package home

import (
	"net/http"
)

func Home() {
	fs := http.FileServer(http.Dir("./src"))
	http.Handle("/", fs)
}
