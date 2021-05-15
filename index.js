require('dotenv').config();

const base64ToImage = require('base64-to-image');
const db = require("./connection");

(async () => {
    const images = await db.selectImages();
    images?.map(img => {
        blobToFile(img.blob, img.file_name)
    })
    return;
})();

async function blobToFile(base64, fileName) {
    var optionalObj = { 'fileName': fileName, 'type': process.env.type || 'png' };
    base64ToImage(base64, process.env.dir, optionalObj);
}