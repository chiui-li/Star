package main

import (
	"os"
	"os/signal"
	"syscall"

	source "Star/Source"
)

func main() {
	source.ApiAndFileServerStart("10091", "static")
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop
}
