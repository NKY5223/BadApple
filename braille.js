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

    document.getElementById("UI").style.opacity = 0.1;

    const vidCanvas = document.createElement("canvas");
    const vidCtx = vidCanvas.getContext("2d");

    /** @type {string[]} */
    const braille = [];
    for (let i = 0x2800; i < 0x2900; i++) braille.push(String.fromCodePoint(i));
    braille[0] = String.fromCodePoint(0x2801); // 2800 doesnt work because logic
    console.log(braille);

    /** @param {boolean[]} points */
    function getBraille(...points) {
        return braille[
            points[0] +
            (points[1] << 1) +
            (points[2] << 2) +
            (points[3] << 3) +
            (points[4] << 4) +
            (points[5] << 5) +
            (points[6] << 6) +
            (points[7] << 7)
        ]
    }
    function getCoords(x = 0, y = 0) {
        return [
            [x, y],
            [x, y + 1],
            [x, y + 2],
            [x + 1, y],
            [x + 1, y + 1],
            [x + 1, y + 1],
            [x + 1, y + 3],
            [x, y + 3]
        ];
    }
    function getColor(x = 0, y = 0, width = 10, data) {
        return [
            data[(y * width + x) * 4],
            data[(y * width + x) * 4 + 1],
            data[(y * width + x) * 4 + 2],
            data[(y * width + x) * 4 + 3],
        ];
    }
    function luma(r = 0, g = 0, b = 0) {
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

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
                size: {
                    x: 5,
                    y: 5
                },
                text: ""
            });
            map.text.push(texts[texts.length - 1]);
        }

        video.blur();
        window.requestAnimationFrame(function run() {
            if (!map.text.includes(texts[0])) {
                customAlert("Stopped Bad Apple");
                video.remove();
                document.getElementById("UI").style.opacity = 1;
                return;
            }
            vidCtx.drawImage(video, 0, 0, width, height);

            const data = vidCtx.getImageData(0, 0, width, height).data;
            // console.log(data);

            // Data is RGBA[]
            for (let y = 0; y < height; y += 4) {
                let text = texts[y / 4];
                text.text = "";
                for (let x = 0; x < width; x += 2) {
                    text.text += getBraille(
                        ...getCoords(x, y).map(([x, y]) => getColor(x, y, width, data)).map(([r, g, b, a]) => luma(r, g, b) > 127)
                    );
                }
            }

            window.requestAnimationFrame(run);
        });
    });
}