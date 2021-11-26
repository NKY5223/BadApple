let blockCount = 0;
function bad_apple(pixelSize = 5, blockSize = 5) {
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

    camScale = 2;

    document.getElementById("UI").style.opacity = 0.5;

    vidCanvas = document.createElement("canvas");
    const vidCtx = vidCanvas.getContext("2d");

    video.addEventListener("loadeddata", () => {
        console.log("Video loaded");

        const width = video.videoWidth;
        const height = video.videoHeight;

        vidCanvas.width = width;
        vidCanvas.height = height;

        freeCam = true;
        camX = blockSize * width / pixelSize / 2;
        camY = blockSize * height / pixelSize / 2;
        customAlert("Ready");
        
        const blocks = [];

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
                map.block0.push(blocks[blocks.length - 1]);
                blockCount++;
            }
        }

        window.requestAnimationFrame(function run() {
            if (!map.block0.includes(blocks[0])) {
                customAlert("Stopped Bad Apple");
                video.remove();
                document.getElementById("UI").style.opacity = 1;
                return;
            }
            vidCtx.drawImage(video, 0, 0, width, height);

            const data = vidCtx.getImageData(0, 0, width, height).data;
            // Data is RGBA[]
            for (let y = 0, num = 0; y < height; y += pixelSize) {
                for (let x = 0; x < width; x += pixelSize, num++) {
                    let r = 0;
                    let g = 0;
                    let b = 0;

                    for (let dy = 0; dy < pixelSize; dy++) {
                        for (let dx = 0; dx < pixelSize; dx++) {
                            r += data[((y + dy) * width + x + dx) * 4];
                            g += data[((y + dy) * width + x + dx) * 4 + 1];
                            b += data[((y + dy) * width + x + dx) * 4 + 2];
                        }
                    }

                    r /= pixelSize * pixelSize;
                    g /= pixelSize * pixelSize;
                    b /= pixelSize * pixelSize;
                    blocks[num].color = `rgb(${r}, ${g}, ${b})`;
                }
            }


            window.requestAnimationFrame(run);
        });
    });
}