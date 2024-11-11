package gameof

import (
	"net/http"
	"wcmd/ip"
)

func Game() {
	fs := http.FileServer(http.Dir("./game"))

	// Wrap the file server handler to log the IP.
	http.HandleFunc("/game/", func(w http.ResponseWriter, r *http.Request) {
		ip.GetIP(r)
		http.StripPrefix("/game", fs).ServeHTTP(w, r)
	})
}
