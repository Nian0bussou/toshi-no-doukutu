package serveicon

import (
	"net/http"
)

func Icon() {
	http.HandleFunc("/favicon.ico", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "icon.ico")
	})
}
