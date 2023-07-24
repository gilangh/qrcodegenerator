const QRCode = require("qrcode");
const axios = require("axios");
const https = require("https");

const { createCanvas, loadImage } = require("canvas");

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

async function create(dataForQRcode, center_image_url, width, cwidth, cheight) {
  const canvas = createCanvas(width, width);
  QRCode.toCanvas(canvas, dataForQRcode, {
    errorCorrectionLevel: "H",
    width: 800,
    color: {
      dark: "#7c1a78",
      light: "#ffffff",
    },
  });
  //
  const imageBuffer = await downloadImage(center_image_url);
  const base64 = imageBuffer.toString("base64");
  const center_image = `data:image/jpeg;base64,${base64}`;

  const ctx = canvas.getContext("2d");
  const img = await loadImage(center_image);
  const centerW = (width - cwidth) / 2;
  const centerH = (width - cheight) / 2;
  ctx.drawImage(img, centerW, centerH, cwidth, cheight);
  return canvas.toDataURL("image/png");
}

async function main() {
  const qrCode = await create(
    "00020101021226580009SG.PAYNOW010120213201543956D0020301004142023072110381952045999530370254042.005802SG5918FOMO PAY PTE. LTD.6009SINGAPORE62260122QY0301202307210889914163049FDD",
    "https://www.abs.org.sg/images/default-album/abs-logo28f7a99f299c69658b7dff00006ed795.png",
    800,
    211,
    133
  );

  console.log(qrCode);
}

async function downloadImage(url) {
  const response = await axios({
    url,
    responseType: "arraybuffer",
    httpsAgent: httpsAgent,
  });

  return Buffer.from(response.data, "binary");
}

main();
