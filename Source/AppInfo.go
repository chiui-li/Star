package Source

import (
	"encoding/json"
	"runtime"
)

type GoAppInfo struct {
	NumGoroutine int    `json:"goroutineNums"`
	Alloc        uint64 `json:"alloc"`
	Sys          uint64 `json:"sys"`
	NumGC        uint32 `json:"numGc"`
	HeapAlloc    uint64 `json:"heapAlloc"`
	HeapSys      uint64 `json:"heapSys"`
	StackInuse   uint64 `json:"stackInuse"`
}

func BytetoMb(u uint64) float64 {
	return float64(u) / 1048576 // 1024 * 1024
}

func GetAppInfo() []byte {
	var m runtime.MemStats
	runtime.ReadMemStats(&m)
	if infoJson, err := json.Marshal(GoAppInfo{
		NumGoroutine: runtime.NumGoroutine(),
		Alloc:        m.Alloc,
		Sys:          m.Sys,
		NumGC:        m.NumGC,
		HeapAlloc:    m.HeapAlloc,
		HeapSys:      m.HeapSys,
		StackInuse:   m.StackInuse,
	}); err != nil {
		return []byte(`{"errMsg": "系统信息序列化错误"}`)
	} else {
		return (infoJson)
	}
}
