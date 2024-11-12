package home

import (
	"fmt"
	"net/http"
	"wcmd/ip"
)

func Home() {
	fs := http.FileServer(http.Dir("./src"))

	// Custom handler to log IP and serve files
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		ip.GetIP(r)
		fmt.Println("INFO: home; accessed")
		fs.ServeHTTP(w, r)
	})
}
