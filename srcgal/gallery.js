async function loadImages() {
  try {
    const selector = document.getElementById("pathSelector");
    const pathIndex = selector.value; // Get selected path index
    const response = await fetch(`/api/images?path=${pathIndex}`);

    if (!response.ok) {
      throw new Error("Failed to load images");
    }

    const images = await response.json();
    const gallery = document.getElementById("gallery");

    if (!gallery) {
      throw new Error("Gallery element not found in the document");
    }

    gallery.innerHTML = "";

    images.forEach((imageUrl) => {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.target = "_blank";

      const img = document.createElement("img");
      img.src = imageUrl;
      img.alt = "Gallery Image";

      link.appendChild(img);
      gallery.appendChild(link);
    });
  } catch (error) {
    console.error("Error loading images:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadImages);
