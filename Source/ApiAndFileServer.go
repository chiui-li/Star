package Source

import (
	"fmt"
	"net/http"
)

func ApiAndFileServerStart(port string, staticFileDir string) {
	mux := http.NewServeMux()
	// 注册路由
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.FileServer(http.Dir(staticFileDir)).ServeHTTP(w, r)
	})
	mux.HandleFunc("/api/appInfo", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("content-type", "application/json")
		w.Write((GetAppInfo()))
	})

	go func() {
		fmt.Println("api/file server start on http://0.0.0.0:" + port)
		if err := http.ListenAndServe("0.0.0.0:"+port, mux); err != nil {
			fmt.Println("api/file server start error", err)
			return
		}
	}()
}
