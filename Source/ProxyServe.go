package Source

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"runtime"
)

type FrontendConfig struct {
	Host string
}

type BackendConfig struct {
	URL string
}

type SubRule struct {
	FrontendCfg FrontendConfig
	BackendCfg  BackendConfig
}

type ServerRule struct {
	Port     string
	Ipv6     bool
	Ipv4     bool
	Name     string
	Tls      bool
	Id       string
	SubRules []SubRule
}

type ProxyServerManger struct {
	serverRules   []ServerRule
	ctx           context.Context
	cancel        context.CancelFunc
	serverChanMap map[string]chan string
}

func HostPort(host string, port string) string {
	if port == "443" || port == "80" {
		return host
	}
	return host + ":" + port
}

func (this *ProxyServerManger) Close(somePort string) {
	if somePort == "all" {
		if this.cancel != nil {
			this.cancel()
		}
		this.cancel = nil
		this.ctx = nil
	}
	if this.serverChanMap[somePort] != nil {
		this.serverChanMap[somePort] <- "close"
	}

}

func (this *ProxyServerManger) startSomeRule(rule *ServerRule) {
	this.createContextWhenNil()
	proxyMap := map[string]*httputil.ReverseProxy{}
	for _, sub := range rule.SubRules {
		url, err := url.Parse(sub.BackendCfg.URL)
		if err != nil {
			println("err", err)
			continue
		}
		proxy := httputil.NewSingleHostReverseProxy(url)
		proxy.ModifyResponse = func(r *http.Response) error {
			r.Header.Add("x-proxy-by", "golang")
			fmt.Println(runtime.NumGoroutine())
			return nil
		}
		proxy.Director = nil
		proxy.Rewrite = func(pr *httputil.ProxyRequest) {
			tragetUrl, _ := url.Parse(sub.BackendCfg.URL)
			pr.Out.Host = tragetUrl.Host
			pr.SetURL(tragetUrl)
		}
		proxyMap[HostPort(sub.FrontendCfg.Host, rule.Port)] = proxy
	}
	mux := http.NewServeMux()
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if proxyMap[r.Host] != nil {
			proxyMap[r.Host].ServeHTTP(w, r)
		} else {
			fmt.Fprint(w, "not found:"+r.Host)
		}
	})
	server := &http.Server{
		Addr:    "0.0.0.0:" + rule.Port,
		Handler: mux,
	}
	serverCloseChan := make(chan string)
	this.serverChanMap[rule.Port] = serverCloseChan
	go func() {
		defer func() {
			server.Close()
			close(serverCloseChan)
			log.Println("server closed at: ", server.Addr)
		}()
		if rule.Tls {
			// server.ListenAndServeTLS()
		} else {
			go server.ListenAndServe()
		}
		select {
		case <-serverCloseChan:
		case <-this.ctx.Done():
		}
	}()
	log.Println("server listening at: ", server.Addr)
}

func (this *ProxyServerManger) Start() {
	this.Close("all")
	this.createContextWhenNil()
	for _, rule := range this.serverRules {
		this.startSomeRule(&rule)
	}
}

func (this *ProxyServerManger) createContextWhenNil() {
	if this.ctx == nil {
		ctx, cancel := context.WithCancel(context.TODO())
		this.ctx = ctx
		this.cancel = cancel
	}
}

// func main() {
// 	manger := ProxyServerManger{
// 		serverRules: []ServerRule{
// 			{
// 				Port: "5678",
// 				Name: "test1",
// 				SubRules: []SubRule{
// 					{
// 						BackendCfg: BackendConfig{
// 							URL: "http://www.baidu.com",
// 						},
// 						FrontendCfg: FrontendConfig{
// 							Host: "www.test0.com",
// 						},
// 					},
// 					{
// 						BackendCfg: BackendConfig{
// 							URL: "http://localhost:3000",
// 						},
// 						FrontendCfg: FrontendConfig{
// 							Host: "www.test1.com",
// 						},
// 					},
// 				},
// 			},

// 			{
// 				Port: "80",
// 				Name: "test2",
// 				SubRules: []SubRule{
// 					{
// 						BackendCfg: BackendConfig{
// 							URL: "http://www.baidu.com",
// 						},
// 						FrontendCfg: FrontendConfig{
// 							Host: "www.test0.com",
// 						},
// 					},
// 					{
// 						FrontendCfg: FrontendConfig{
// 							Host: "www.test1.com",
// 						},
// 						BackendCfg: BackendConfig{
// 							URL: "http://localhost:9900",
// 						},
// 					},
// 				},
// 			},
// 		},
// 		serverChanMap: map[string]chan string{},
// 	}

// 	mux := http.NewServeMux()

// 	// 注册路由
// 	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
// 		http.FileServer(http.Dir("static")).ServeHTTP(w, r)
// 	})
// 	mux.HandleFunc("/api/appInfo", func(w http.ResponseWriter, r *http.Request) {
// 		w.Header().Add("content-type", "text/json")
// 		w.Write((GetAppInfo()))
// 	})
// 	go http.ListenAndServe(":10091", mux)

// 	// 启动服务器，传入自定义 mux
// 	fmt.Println("Server on :10091")

// 	manger.Start()
// 	n := runtime.NumGoroutine()
// 	fmt.Printf("当前 goroutine 数量: %d\n", n)
// 	stop := make(chan os.Signal, 1)
// 	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
// 	<-stop
// }
