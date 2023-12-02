const express = require('express')
const router = express.Router();
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");



//download images from the web to a local destination
router.post("/upload-by-link", async (req, res) => {
    const { link } = req.body;
    const newName = "photo" + Date.now() + ".jpg";
    await imageDownloader.image({
      url: link,
      dest: __dirname + "/../uploads/" + newName,
    });
    res.json(newName);
  });

  // to store files locally
  const photosMiddleware = multer({ dest: __dirname + "/../uploads/" });
  router.post("/", photosMiddleware.array("photos", 100), (req, res) => {
    console.log("Upload file,", req.files)

    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
      const { path, filename, originalname } = req.files[i];
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      const newPath = path + "." + ext;

      fs.renameSync(path, newPath);
      uploadedFiles.push(filename + "." + ext);
    }
    res.json(uploadedFiles);
  });

  module.exports = router;
