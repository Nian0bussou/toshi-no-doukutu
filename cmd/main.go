package main

import (
	"fmt"
	"net/http"

	"wcmd/assert"
	"wcmd/flags"
	"wcmd/gallery"
	"wcmd/gameof"
	"wcmd/gtime"
	"wcmd/home"
	"wcmd/ip"
)

func main() {

	v := flags.GetFlags()

	gallery.Gallery(v.Gallery_path) // on .../gal
	gameof.Game()                   // on .../game
	home.Home()                     // on .../
	ip.SetFlag(v.Only_local)

	fmt.Println(gtime.GetTime(), "Listening on :", v.Port)

	err := http.ListenAndServe(fmt.Sprintf(":%d", v.Port), nil)
	assert.NoError(err, "could not start server")

}
