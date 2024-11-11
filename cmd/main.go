package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"wcmd/gallery"
	"wcmd/gameof"
	"wcmd/home"
)

func main() {
	home.Home()       // on .../
	gallery.Gallery() // on .../gal
	gameof.Game()     // on .../game

	http.HandleFunc("/save", saveHandler)
	http.HandleFunc("/load", loadHandler)

	log.Print("Listening on :8080...")
	err := http.ListenAndServe(":8080", nil)

	if err != nil {
		log.Fatal(err)
	}
}

type RequestBody struct {
	Content string `json:"content"`
}

func saveHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var reqBody RequestBody
	err := json.NewDecoder(r.Body).Decode(&reqBody)
	if err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	// Save the content to a file
	filePath := filepath.Join("src", "output.txt")
	err = os.WriteFile(filePath, []byte(reqBody.Content), 0644)
	if err != nil {
		http.Error(w, "Failed to save file", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("File saved successfully"))
}

func loadHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	filePath := filepath.Join("src", "output.txt")
	content, err := os.ReadFile(filePath)
	if err != nil {
		// If the file doesn't exist, return an empty string as JSON
		if os.IsNotExist(err) {
			content = []byte("")
		} else {
			http.Error(w, "Failed to load file", http.StatusInternalServerError)
			return
		}
	}

	// Send the file content as JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(RequestBody{Content: string(content)})
}
