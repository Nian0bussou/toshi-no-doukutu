package gameof

import (
	"fmt"
	"net/http"
	"wcmd/gtime"
	"wcmd/ip"
)

func Game() {
	fs := http.FileServer(http.Dir("./game"))
	http.HandleFunc("/game/", func(w http.ResponseWriter, r *http.Request) {
		ip.GetIP(r)
		fmt.Println(gtime.GetTime(), "INFO: game; accessed")
		http.StripPrefix("/game", fs).ServeHTTP(w, r)
	})
}
