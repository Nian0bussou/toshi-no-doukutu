package gallery

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"

	"wcmd/assert"
	"wcmd/gtime"
	"wcmd/ip"
)

type Data struct {
	Paths []string `json:"paths"`
}

func parse_imagesJSon(filename string) []string {
	byteValue, err := os.ReadFile(filename)
	assert.NoError(err, "cant read file")

	var data Data
	err = json.Unmarshal(byteValue, &data)
	assert.NoError(err, "failed to parse json")

	return data.Paths
}

const galpath = "./srcgal"

var baseGalPath = galpath + "/images/"
var paths []string

func Gallery(file string) {
	paths = parse_imagesJSon(file)

	fs := http.FileServer(http.Dir(galpath))
	http.Handle("/gal/", http.StripPrefix("/gal", fs))
	http.HandleFunc("/get_paths", getPathsHandler)
	http.HandleFunc("/api/images", gal)
}

func gal(w http.ResponseWriter, r *http.Request) {
	ip.GetIP(r)
	fmt.Println(gtime.GetTime(), "INFO: gallery; was access")
	// Get 'path' query parameter (index of folder)
	pathIndexStr := r.URL.Query().Get("path")
	pathIndex, err := strconv.Atoi(pathIndexStr)

	if err != nil || pathIndex < 0 || pathIndex >= len(paths) {
		msg := "Invalid path index"
		http.Error(w, msg, http.StatusBadRequest)
		fmt.Println(gtime.GetTime(), "ERROR: gallery;", msg)
		return
	}

	// Read images from the specified path
	pindex := paths[pathIndex]
	dirPath := baseGalPath + pindex
	files, err := os.ReadDir(dirPath)

	if err != nil {
		msg := "unable to read img dir"
		http.Error(w, msg, http.StatusInternalServerError)
		fmt.Println(gtime.GetTime(), "ERROR: gallery; ", msg)
		return
	}

	var images []string
	for _, file := range files {
		filename := file.Name()
		images = append(images, "/gal/images/"+pindex+"/"+filename)
		fmt.Println(gtime.GetTime(), "INFO: gallery; loaded :\n", pindex, filename)
	}

	// Return JSON list of image paths
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(images)
}

func getPathsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(paths)
}
