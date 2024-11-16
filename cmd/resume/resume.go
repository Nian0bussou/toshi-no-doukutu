package resume

import (
	"fmt"
	"net/http"

	"wcmd/gtime"
	"wcmd/ip"
)

func Resume() {
	fs := http.FileServer(http.Dir("./resume"))
	http.HandleFunc("/resume/", func(w http.ResponseWriter, r *http.Request) {
		ip.GetIP(r)
		fmt.Println(gtime.GetTime(), "INFO: resume; accessed")
		http.StripPrefix("/resume", fs).ServeHTTP(w, r)
	})
}
