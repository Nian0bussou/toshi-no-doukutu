package flags

import "flag"

type Values struct {
	Only_local   bool
	Gallery_path string
	Port         int
}

func GetFlags() (val Values) {

	flag.BoolVar(&val.Only_local, "ol", true, "only allow local ip")
	flag.StringVar(&val.Gallery_path, "galpath", "images_paths.json", "specify the path of the json to the images paths for gallery")
	flag.IntVar(&val.Port, "port", 8080, "use specific IP port")

	flag.Parse()
	return val
}
