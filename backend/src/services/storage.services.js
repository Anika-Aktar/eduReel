require('dotenv').config();
const ImageKit = require('imagekit');
const { Readable } = require('stream');

const imagekitClient = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadfile(file) {
    try {
        const stream = Readable.from(file); // convert buffer to stream

        const result = await imagekitClient.upload({
            file: stream,
            fileName: `video_${Date.now()}.mp4`,
            folder: "/videos",
            useUniqueFileName: true,
        });
        return result;
    } catch (error) {
        console.error("Upload Error:", error.message);
        throw error;
    }
}

module.exports = { uploadfile }