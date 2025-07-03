const uploadInput = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const distanceOutput = document.getElementById("distance");

uploadInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const img = new Image();
  img.onload = async () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults((results) => {
      if (results.multiFaceLandmarks.length > 0) {
        const lm = results.multiFaceLandmarks[0];

        // Define points
        const points = {
          // Vertical
          hairline: lm[10],
          noseTop: lm[168],
          noseBottom: lm[2],
          lips: lm[13],
          chin: lm[152],

          // Horizontal
          leftEar: lm[234],
          leftEyeStart: lm[133],
          leftEyeEnd: lm[246],
          rightEyeStart: lm[362],
          rightEyeEnd: lm[263],
          rightEar: lm[454],
        };

        const pixelCoords = {};
        for (let key in points) {
          pixelCoords[key] = {
            x: points[key].x * canvas.width,
            y: points[key].y * canvas.height,
          };
        }

        const getDistance = (p1, p2) => {
          return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
        };

        // Vertical distances
        const d1 = getDistance(pixelCoords.hairline, pixelCoords.noseTop);
        const d2 = getDistance(pixelCoords.noseTop, pixelCoords.noseBottom);
        const d3 = getDistance(pixelCoords.noseBottom, pixelCoords.lips);
        const d4 = getDistance(pixelCoords.lips, pixelCoords.chin);

        // Horizontal distances
        const h1 = getDistance(pixelCoords.leftEar, pixelCoords.leftEyeEnd);
        const h2 = getDistance(pixelCoords.leftEyeStart, pixelCoords.leftEyeEnd);
        const h3 = getDistance(pixelCoords.leftEyeStart, pixelCoords.rightEyeStart); // ✅ updated
        const h4 = getDistance(pixelCoords.rightEyeStart, pixelCoords.rightEyeEnd);
        const h5 = getDistance(pixelCoords.rightEyeEnd, pixelCoords.rightEar);

//////////////

//let d1, d2, d3, d4, h1, h2, h3, h4, h5;
var pd1, pd2, pd3, pd4, ph1, ph2, ph3, ph4, ph5;
const D = d1 + d2 + d3 + d4;
const H = h1 + h2 + h3 + h4 + h5;

if (D / 3 > d1)
    pd1 = (((d1 * 100) / (D / 3)) * 16.6) / 100;
else if (D / 3 < d1)
    pd1 = ((200 - ((d1 * 100) / (D / 3))) * 16.6) / 100;
else
    pd1 = 16.6;

if (D / 3 > d2)
    pd2 = (((d2 * 100) / (D / 3)) * 16.6) / 100;
else if (D / 3 < d2)
    pd2 = ((200 - ((d2 * 100) / (D / 3))) * 16.6) / 100;
else
    pd2 = 16.6;

if (D / 9 > d3)
    pd3 = (((d3 * 100) / (D / 9)) * 5.3) / 100;
else if (D / 9 < d3)
    pd3 = ((200 - ((d3 * 100) / (D / 9))) * 5.3) / 100;
else
    pd3 = 5.3;

if ((D / 9) * 2 > d4)
    pd4 = (((d4 * 100) / ((D / 9) * 2)) * 10.6) / 100;
else if ((D / 9) * 2 < d4)
    pd4 = ((200 - ((d4 * 100) / ((D / 9) * 2))) * 10.6) / 100;
else
    pd4 = 10.6;

if (H / 5 > h1)
    ph1 = (((h1 * 100) / (H / 5)) * 10) / 100;
else if (H / 5 < h1)
    ph1 = ((200 - ((h1 * 100) / (H / 5))) * 10) / 100;
else
    ph1 = 10;

if (H / 5 > h2)
    ph2 = (((h2 * 100) / (H / 5)) * 10) / 100;
else if (H / 5 < h2)
    ph2 = ((200 - ((h2 * 100) / (H / 5))) * 10) / 100;
else
    ph2 = 10;

if (H / 5 > h3)
    ph3 = (((h3 * 100) / (H / 5)) * 10) / 100;
else if (H / 5 < h3)
    ph3 = ((200 - ((h3 * 100) / (H / 5))) * 10) / 100;
else
    ph3 = 10;

if (H / 5 > h4)
    ph4 = (((h4 * 100) / (H / 5)) * 10) / 100;
else if (H / 5 < h4)
    ph4 = ((200 - ((h4 * 100) / (H / 5))) * 10) / 100;
else
    ph4 = 10;

if (H / 5 > h5)
    ph5 = (((h5 * 100) / (H / 5)) * 10) / 100;
else if (H / 5 < h5)
    ph5 = ((200 - ((h5 * 100) / (H / 5))) * 10) / 100;
else
    ph5 = 10;

const P = pd1 + pd2 + pd3 + pd4 + ph1 + ph2 + ph3 + ph4 + ph5;


//////////////
        // Draw landmarks
        ctx.fillStyle = "red";
        Object.values(pixelCoords).forEach((pt) => {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 4, 0, 2 * Math.PI);
          ctx.fill();
        });

        // Draw lines
        ctx.strokeStyle = "green";
        ctx.lineWidth = 2;

        const vKeys = ["hairline", "noseTop", "noseBottom", "lips", "chin"];
        const hKeys = [
          "leftEar",
          "leftEyeEnd",
          "leftEyeStart", // added to match h3 change
          "rightEyeStart",
          "rightEyeEnd",
          "rightEar",
        ];

        for (let i = 0; i < vKeys.length - 1; i++) {
          ctx.beginPath();
          ctx.moveTo(pixelCoords[vKeys[i]].x, pixelCoords[vKeys[i]].y);
          ctx.lineTo(pixelCoords[vKeys[i + 1]].x, pixelCoords[vKeys[i + 1]].y);
          ctx.stroke();
        }

        for (let i = 0; i < hKeys.length - 1; i++) {
          ctx.beginPath();
          ctx.moveTo(pixelCoords[hKeys[i]].x, pixelCoords[hKeys[i]].y);
          ctx.lineTo(pixelCoords[hKeys[i + 1]].x, pixelCoords[hKeys[i + 1]].y);
          ctx.stroke();
        }

        // Display results
        distanceOutput.innerHTML = `
           <strong>Vertical Distances (pixels):</strong><br>
           1. Hairline to Top of Nose: <strong>${Math.round(d1)}</strong> px<br>
           2. Top of Nose to Nose Tip: <strong>${Math.round(d2)}</strong> px<br>
           3. Nose Tip to Lips: <strong>${Math.round(d3)}</strong> px<br>
           4. Lips to Chin: <strong>${Math.round(d4)}</strong> px<br><br>

           <strong>Horizontal Distances (pixels):</strong><br>
           1. Left Ear to End of Left Eye: <strong>${Math.round(h1)}</strong> px<br>
           2. Start to End of Left Eye: <strong>${Math.round(h2)}</strong> px<br>
           3. Start of Left Eye to Start of Right Eye: <strong>${Math.round(h3)}</strong> px<br> <!-- ✅ updated label -->
           4. Start to End of Right Eye: <strong>${Math.round(h4)}</strong> px<br>
           5. End of Right Eye to Right Ear: <strong>${Math.round(h5)}</strong> px

          <strong>Perfectness of face:</strong><br>
          <strong>${Math.round(P)}</strong>%<br>
        `;
      }
    });

    await faceMesh.send({ image: img });
  };

  const reader = new FileReader();
  reader.onload = (e) => {
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
});
