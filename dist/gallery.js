"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Recursive function to create HTML for directory structure
function createGalleryNode(node) {
    var _a;
    const container = document.createElement("div");
    container.classList.add(node.isDir ? "folder" : "image");
    if (node.isDir) {
        const folderTitle = document.createElement("h2");
        folderTitle.textContent = node.name;
        container.appendChild(folderTitle);
        // Create a div to contain children
        const childrenContainer = document.createElement("div");
        childrenContainer.classList.add("children");
        // Recursively add children nodes
        (_a = node.children) === null || _a === void 0 ? void 0 : _a.forEach((child) => {
            childrenContainer.appendChild(createGalleryNode(child));
        });
        container.appendChild(childrenContainer);
    }
    else {
        // Image element
        const img = document.createElement("img");
        img.src = node.path;
        img.alt = node.name;
        container.appendChild(img);
    }
    return container;
}
// Fetch and render image gallery structure
function loadGallery() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch("/api/images");
            const imageTree = yield response.json();
            const gallery = document.getElementById("gallery");
            if (!gallery) {
                console.log("cant load gallery");
                return;
            }
            // Clear existing content
            gallery.innerHTML = "";
            // Append each root node to the gallery
            imageTree.forEach((node) => {
                gallery.appendChild(createGalleryNode(node));
            });
        }
        catch (error) {
            console.error("Error loading gallery:", error);
        }
    });
}
document.addEventListener("DOMContentLoaded", loadGallery);
