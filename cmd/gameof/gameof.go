package gameof

import (
	"net/http"
)

func Game() {
	fs := http.FileServer(http.Dir("./game"))
	http.Handle("/game/", http.StripPrefix("/game", fs))
}
