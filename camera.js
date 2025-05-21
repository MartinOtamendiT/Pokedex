const toggleCameraButton = document.getElementById('toggleCamera');
const cameraFeed = document.getElementById('camera-feed');
const cameraCanvas = document.getElementById('camera-canvas');
const takePhotoButton = document.getElementById('take-photo-button');
const pokeScreen = document.querySelector('.pokeScreen'); // Assuming pokeScreen is the target container
const pokeImg = document.getElementById("pokeImg");

// Function to start the camera feed
async function startCamera() {
    try {
        pokeImg.style.display = 'none';
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        cameraFeed.srcObject = stream;
        cameraFeed.style.display = 'block';
        takePhotoButton.style.display = 'block';
        // Append the video feed to the pokeScreen div
        pokeScreen.appendChild(cameraFeed);
    } catch (err) {
        console.error('Error accessing the camera:', err);
        alert('Could not access the camera. Please make sure you have a camera connected and have granted permission.');
        cameraFeed.style.display = 'none';
        takePhotoButton.style.display = 'none';
    }
}

// Function to take a photo
takePhotoButton.addEventListener('click', () => {
    //const blueLight=document.getElementById("blueLight");
    //blueLight.classList.add("blinkBlueLight");

    const context = cameraCanvas.getContext('2d');
    cameraCanvas.width = cameraFeed.videoWidth;
    cameraCanvas.height = cameraFeed.videoHeight;
    context.drawImage(cameraFeed, 0, 0, cameraCanvas.width, cameraCanvas.height);
    const imageDataUrl = cameraCanvas.toDataURL('image/png'); // Or 'image/jpeg'
    pokeImg.src = imageDataUrl; // Display the captured image in the pokeImg element

    // Send the image data to the backend
    fetch('/upload_image', {
        method: 'POST',
        body: JSON.stringify({ image: imageDataUrl }),
        headers: { 'Content-Type': 'application/json' }
    }).then(response => {
        if (response.ok) {
            console.log('Image uploaded successfully!');
        } else {
            console.error('Image upload failed.');
        }
    }).catch(error => {
        console.error('Error sending image:', error);
    });
});

let cameraActive = false;
toggleCameraButton.addEventListener('click', () => {
    if (!cameraActive) {
        startCamera();
        cameraActive = true;
    } else {
        // Stop the camera feed if active
        const stream = cameraFeed.srcObject;
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
        }
        cameraFeed.style.display = 'none';
        takePhotoButton.style.display = 'none';
        pokeImg.style.display = 'block';
        // Optional: Remove the video element from pokeScreen if needed
        pokeScreen.removeChild(cameraFeed);
        cameraActive = false;
    }
});
