const videoModel = require('../models/video.models')
const { uploadfile } = require("../services/storage.services")
const jwt = require("jsonwebtoken")

async function createVideo(req, res) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    console.log("Uploading to ImageKit...");
const uploadedFile = await uploadfile(req.file.buffer);
console.log("ImageKit response:", uploadedFile); 

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role != "teacher") {
            return res.status(403).json({ message: "You don't have access to upload content!" })
        }

    } catch (err) {
        if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
        return res.status(500).json({ error: err.message });
    }

    // Now handle the actual upload
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No video file provided" });
        }

        // Upload file to ImageKit
        const uploadedFile = await uploadfile(req.file.buffer);

        // Save to database
        const videoData = {
            uri: uploadedFile.url,
            title: req.body.title,
            teacher_id: decoded.id
        };

        const result = await videoModel.createVideo(videoData);

        return res.status(201).json({
            message: "Video uploaded successfully",
            videoId: result.insertId,
            url: uploadedFile.url
        });

    } catch (err) {
        console.error("Upload error:", err.message);
        return res.status(500).json({ error: err.message });
    }
}

module.exports = { createVideo }