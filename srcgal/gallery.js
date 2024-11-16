async function loadImages() {
    try {
        const selector = document.getElementById('pathSelector')
        const pathIndex = selector.value // Get selected path index
        const response = await fetch(`/api/images?path=${pathIndex}`)

        if (!response.ok) {
            console.log('Invalid path selected')
            window.location.href = '/'
        }

        const images = await response.json()
        const gallery = document.getElementById('gallery')

        if (!gallery) {
            throw new Error('Gallery element not found in the document')
        }

        gallery.innerHTML = ''

        images.forEach((imageUrl) => {
            const link = document.createElement('a')
            link.href = imageUrl
            link.target = '_blank'

            const img = document.createElement('img')
            img.src = imageUrl
            img.alt = 'Gallery Image'

            link.appendChild(img)
            gallery.appendChild(link)
        })
    } catch (error) {
        console.error('Error loading images:', error)
    }
}

document.addEventListener('DOMContentLoaded', loadImages)

//#region  selector

async function populateSelector() {
    try {
        // Fetch the JSON data from the server
        const response = await fetch('/get_paths')
        const data = await response.json()

        // Reference the select element
        const selector = document.getElementById('pathSelector')

        // Clear existing options, if any
        selector.innerHTML = ''

        // Add new options from the JSON data
        data.forEach((path, index) => {
            const option = document.createElement('option')
            option.value = index
            option.textContent = path
            selector.appendChild(option)
        })
    } catch (error) {
        console.error('Error loading paths:', error)
    }
}

// Call the function to populate the selector when the page loads
window.onload = populateSelector

//#endregion
