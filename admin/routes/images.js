const path = require('path')
const fs = require('fs')
const express = require('express');
const router = express.Router();
const sharp = require('sharp')

const srcDir = path.join(process.cwd(), 'src/assets/images/home/original/')
const destDir = path.join(process.cwd(), 'src/assets/images/home/thumb/')


processAllImages();

function processImage(img) {
  sharp(srcDir + img)
    .resize({
      width: 840,
      height: 600
    })
    .jpeg( {quality: 90})
    .toFile(destDir + img)

    .catch(err => {
    console.error(err.message)
  })
}

function processThumb(img) {
  sharp(srcDir + img)
    .resize({
      width: 400,
      height: 400
    })
    .jpeg( {quality: 90})
    .toFile(destDir + img)

    .catch(err => {
    console.error(err.message)
  })
}

function processAllImages() {
  fs.promises.readdir(srcDir)
  .then(entries => {
    entries.forEach((entry, i) => {
      processThumb(entry)
    });

  })
  .catch(err => {
    console.error(err.message)
  })
}


async function getMetadata() {
  const metadata = await sharp(imageDir + 'ooze-thumbnail.jpg').metadata();
  console.log(metadata);
}

module.exports = router