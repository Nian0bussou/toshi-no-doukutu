package main

import (
	"fmt"
	"net/http"

	"wcmd/assert"
	"wcmd/gallery"
	"wcmd/gameof"
	"wcmd/gtime"
	"wcmd/home"
)

func main() {

	home.Home()                          // on .../
	gallery.Gallery("images_paths.json") // on .../gal
	gameof.Game()                        // on .../game

	fmt.Println(gtime.GetTime(), "Listening on :8080...")

	err := http.ListenAndServe(":8080", nil)
	assert.NoError(err, "could not start server")

}
