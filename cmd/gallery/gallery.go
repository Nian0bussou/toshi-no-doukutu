package gallery

import (
	"encoding/json"
	"fmt"
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
	fmt.Println("INFO: gallery; was access")
	// Get 'path' query parameter (index of folder)
	pathIndexStr := r.URL.Query().Get("path")
	pathIndex, err := strconv.Atoi(pathIndexStr)
	if err != nil || pathIndex < 0 || pathIndex >= len(paths) {
		msg := "Invalid path index"
		http.Error(w, msg, http.StatusBadRequest)
		fmt.Println("ERROR: gallery;", msg)
		return
	}

	// Read images from the specified path
	dirPath := baseGalPath + paths[pathIndex]
	files, err := os.ReadDir(dirPath)
	if err != nil {
		msg := "Unable to read image directory"
		http.Error(w, msg, http.StatusInternalServerError)
		fmt.Println("ERROR: gallery; ", msg)
		return
	}

	var images []string
	for _, file := range files {
		// Add only files with common image extensions
		if filepath.Ext(file.Name()) == ".jpg" || filepath.Ext(file.Name()) == ".png" || filepath.Ext(file.Name()) == ".jpeg" {
			filename := file.Name()
			images = append(images, "/gal/images/"+paths[pathIndex]+"/"+filename)
			fmt.Println("INFO: gallery; loaded :\n", paths[pathIndex], filename)
		}
	}

	// Return JSON list of image paths
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(images)
}
