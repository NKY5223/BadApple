    function bad_apple(ox = 0, oy = 0) {
        const texts = [];

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

        const vidCanvas = document.createElement("canvas");
        const vidCtx = vidCanvas.getContext("2d");

        video.addEventListener("loadeddata", () => {
            console.log("Video loaded");

            const width = video.videoWidth;
            const height = video.videoHeight;

            vidCanvas.width = width;
            vidCanvas.height = height;

            freeCam = true;
            camX = ox;
            camY = oy;
            customAlert("Ready");

            for (let y = 0; y < height; y += 4) {
                texts.push({
                    pos: {
                        x: ox,
                        y: oy + 2.0 * (y - height / 2)
                    },
                    text: ""
                });
                parsedMap.text.push(texts[texts.length - 1]);
            }

            video.addEventListener("play", () => {
                video.blur();
                window.requestAnimationFrame(function run() {
                    vidCtx.drawImage(video, 0, 0, width, height);

                    const data = vidCtx.getImageData(0, 0, width, height).data;
                    
                    // Data is RGBA[]
                    for (let y = 0; y < height; y += 4) {
                        let text = texts[y / 4];
                        text.text = "";
                        for (let x = 0; x < width; x += 2) {
                            text.text += braille(
                                data[(y * width + x) * 4] > 127,
                                data[((y + 1) * width + x) * 4] > 127,
                                data[((y + 2) * width + x) * 4] > 127,                            
                                data[(y * width + x + 1) * 4] > 127,
                                data[((y + 1) * width + x + 1) * 4] > 127,
                                data[((y + 1) * width + x + 1) * 4] > 127,
                                data[((y + 3) * width + x + 1) * 4] > 127,
                                data[((y + 3) * width + x) * 4] > 127,
                            );
                        }
                    }


                    window.requestAnimationFrame(run);
                });
            });
        });
        function braille(p0 = 0, p1 = 0, p2 = 0, p3 = 0, p4 = 0, p5 = 0, p6 = 0, p7 = 0) {
            return String.fromCodePoint(
                0x2800 +
                p0 +
                (p1 << 1) +
                (p2 << 2) +
                (p3 << 3) +
                (p4 << 4) +
                (p5 << 5) +
                (p6 << 6) +
                (p7 << 7)
            );
        }
    }