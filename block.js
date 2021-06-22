let badAppleVideo;
let stopBadApple = false;
function bad_apple(pixelSize = 5, blockSize = 5) {
    const blocks = parsedMap.block0 = [];

    badAppleVideo = document.createElement("video");
    badAppleVideo.src = "badapple.mp4";
    badAppleVideo.controls = true;
    badAppleVideo.crossOrigin = "Anonymous";

    // Styling
    badAppleVideo.style.position = "absolute";
    badAppleVideo.style.display = "block";
    badAppleVideo.style.top = "0px";
    badAppleVideo.style.left = "0px";
    badAppleVideo.style.outline = "none";


    document.body.appendChild(badAppleVideo);

    camScale = 2;

    document.getElementById("UI").style.opacity = 0.5;

    vidCanvas = document.createElement("canvas");
    const vidCtx = vidCanvas.getContext("2d");

    badAppleVideo.addEventListener("loadeddata", () => {
        console.log("Video loaded");

        const width = badAppleVideo.videoWidth;
        const height = badAppleVideo.videoHeight;

        vidCanvas.width = width;
        vidCanvas.height = height;

        freeCam = true;
        camX = blockSize * width / pixelSize / 2;
        camY = blockSize * height / pixelSize / 2;
        customAlert("Ready");

        for (let y = 0; y * pixelSize < height; y++) {
            for (let x = 0; x * pixelSize < width; x++) {
                blocks.push({
                    pos: {
                        x: x * blockSize,
                        y: y * blockSize
                    },
                    size: {
                        x: blockSize,
                        y: blockSize
                    },
                    color: "#000000"
                });
            }
        }

        window.requestAnimationFrame(function badAppleRun() {
            if (stopBadApple) return;
            vidCtx.drawImage(badAppleVideo, 0, 0, width, height);

            const data = vidCtx.getImageData(0, 0, width, height).data;
            // Data is RGBA[]
            for (let y = 0, num = 0; y < height; y += pixelSize) {
                for (let x = 0; x < width; x += pixelSize, num++) {
                    let color = 0;

                    for (let dy = 0; dy < pixelSize; dy++) {
                        for (let dx = 0; dx < pixelSize; dx++) {
                            color += data[((y + dy) * width + x + dx) * 4];
                        }
                    }

                    color /= pixelSize * pixelSize;
                    blocks[num].color = `rgb(${color}, ${color}, ${color})`;
                    // console.log(color);
                }
                // break;
            }


            window.requestAnimationFrame(badAppleRun);
        });
    });
}

function reset() {
    badAppleVideo.remove();
    stopBadApple = true;
    document.getElementById("UI").style.opacity = 1;
}