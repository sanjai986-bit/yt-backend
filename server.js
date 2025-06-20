const express = require('express');
const multer  = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());

const upload = multer({ dest: 'uploads/' });

app.post('/convert', upload.single('video'), (req, res) => {
  const inputPath = req.file.path;
  const outputPath = `${inputPath}.mp3`;

  ffmpeg(inputPath)
    .noVideo()
    .audioCodec('libmp3lame')
    .on('end', () => {
      res.download(outputPath, 'audio.mp3', (err) => {
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      });
    })
    .on('error', err => {
      fs.unlinkSync(inputPath);
      res.status(500).send('Conversion failed.');
    })
    .save(outputPath);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});