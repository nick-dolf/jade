const path = require('path')
const fs = require('fs')
const fse = require('fs-extra')
const multer = require('multer')
const express = require('express')
const router = express.Router()
const sharp = require('sharp')

const srcDir = path.join(process.cwd(), 'src/assets/images/home/original/')
const destDir = path.join(process.cwd(), 'site/assets/images/home/')
const thumbDir = path.join(process.cwd(), 'src/assets/images/home/thumb/')
const imageDir = path.join(process.cwd(), 'src/assets/images')

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fse.mkdirsSync(imageDir + req.url + "/original")
    cb(null, imageDir + req.url + "/original")
  },
  filename: function(req, file, callback) {
    callback(null, file.originalname);
  }
});
var upload = multer({ storage: storage })


router.get('/:dir/:name', (req, res) => {
  const dir = imageDir + req.url

  fse.readJson(dir+'/alt.json')
    .then(data => {
      console.log({"images": data})
      res.render('admin/images', {"images": data, "path": req.url})
    })
    .catch(error => {
      res.render('admin/images', {"images": ""})
    })
})

router.post('/:dir/:name', upload.single('pic'),(req, res) => {
  const dir = imageDir + req.url
  const fname = req.file.filename
  const alt = req.body.alt
  let data = {}

  fse.readJson(dir+'/alt.json')
    .then(fileData => {
      data = fileData
      data[fname] = alt
      fse.writeJson(dir+'/alt.json', data)
      .catch(error => {
        error.log(error.message)
      })
      res.render('admin/images', {"images": data, "path": req.url})

    })
    .catch(error => {
      data[fname] = alt
      
      fse.writeJson(dir+'/alt.json', data)
        .catch(error => {
          error.log(error.message)
        })
      res.render('admin/images', {"images": data, "path": req.url})

    })

  processThumb(dir, fname)
})

/// processAllImages();

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

function processThumb(folder, img) {
  fse.mkdirsSync(folder+"/thumb")
  sharp(folder + '/original/' + img)
    .resize({
      width: 400
    })
    .jpeg( {quality: 90})
    .toFile(folder + '/thumb/' + img)
    .catch(err => {
    console.error(err.message)
  })
}

function processAllImages() {
  fs.promises.readdir(srcDir)
  .then(entries => {
    entries.forEach((entry, i) => {
      processImage(entry)
      processThumb(entry)
    });

  })
  .catch(err => {
    console.error(err.message)
  })
}


async function getMetadata(image) {
  try {
    const metadata = await sharp(image).metadata();
    console.log(metadata);
  } catch (error) {
    console.log(`An error occurred during processing: ${error}`);
  }
}

module.exports = router