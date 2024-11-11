package gallery

import (
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"wcmd/ip"
)

const (
	galpath = "./srcgal"
)

var (
	baseGalPath = galpath + "/images/"
)

// TODO: add more path? ...
var (
	paths = [...]string{
		"ahri",
		"bonten",
		"demontail",
		"elf",
		"chen",
	}
)

func Gallery() {
	// Serve static files from src
	fs := http.FileServer(http.Dir(galpath))
	http.Handle("/gal/", http.StripPrefix("/gal", fs))
	// API endpoint to list image files
	http.HandleFunc("/api/images", gal)
}

func gal(w http.ResponseWriter, r *http.Request) {
	ip.GetIP(r)
	// Get 'path' query parameter (index of folder)
	pathIndexStr := r.URL.Query().Get("path")
	pathIndex, err := strconv.Atoi(pathIndexStr)
	if err != nil || pathIndex < 0 || pathIndex >= len(paths) {
		http.Error(w, "Invalid path index", http.StatusBadRequest)
		return
	}

	// Read images from the specified path
	dirPath := baseGalPath + paths[pathIndex]
	files, err := os.ReadDir(dirPath)
	if err != nil {
		http.Error(w, "Unable to read image directory", http.StatusInternalServerError)
		return
	}

	var images []string
	for _, file := range files {
		// Add only files with common image extensions
		if filepath.Ext(file.Name()) == ".jpg" || filepath.Ext(file.Name()) == ".png" || filepath.Ext(file.Name()) == ".jpeg" {
			images = append(images, "/gal/images/"+paths[pathIndex]+"/"+file.Name())
		}
	}

	// Return JSON list of image paths
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(images)
}
