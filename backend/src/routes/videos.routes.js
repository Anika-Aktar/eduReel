 const express = require('express');
const videoController = require("../controllers/video.controller")

const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
    }
});
 const router = express.Router();


router.post('/upload',upload.single("video"),videoController.createVideo)

 module.exports=router;

