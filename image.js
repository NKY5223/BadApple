function bad_apple(x = 0, y = 0) {

    const video = document.createElement("video");
    video.src = "badapple.mp4";
    video.controls = true;
    video.crossOrigin = "Anonymous";

    // Styling
    video.style.position = "absolute";
    video.style.display = "block";
    video.style.top = "0px";
    video.style.left = "0px";
    video.style.outline = "none";


    document.body.appendChild(video);

    hide(document.getElementById("UI"));

    video.addEventListener("loadeddata", () => {
        console.log("Video loaded");

        const width = video.videoWidth;
        const height = video.videoHeight;

        const image = {
            image: video,
            pos: { x, y },
            size: {
                x: width,
                y: height
            }
        };
        parsedMap.image0.push(image);
    });
}