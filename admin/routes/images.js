const path = require('path')
const fse = require('fs-extra')
const slugify = require('slugify')
const multer = require('multer')
const express = require('express')
const router = express.Router()
const imgProc = require('../utils/imgProc')
const sharp = require('sharp')

// IMAGE DIRECTORIES
const imgSrcDir = path.join(process.cwd(), 'assets/images')
const imgDestDir = path.join(process.cwd(), 'site/assets/images')

// IMAGE STORAGE WITH MULTER
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fse.mkdirsSync(imgSrcDir + req.url + "/original")
    cb(null, imgSrcDir + req.url + "/original")
  },
  filename: function(req, file, callback) {
    callback(null, slugify(file.originalname));
  }
});
var upload = multer({ storage: storage })

// CREATE (POST)
router.post('/:dir/:name', upload.single('pic'),(req, res) => {
  const dir = imgSrcDir + req.url
  const destDir = imgDestDir + req.url
  const fname = slugify(req.file.filename)

  let renderData = {
    "images" : "", 
    "path" : req.url, 
    "folder" : req.params.name
  }

  let data = {}
  let newDetails = {}
  newDetails.alt = req.body.alt
  
  sharp(req.file.path).metadata()
    .then(metadata => {
      newDetails.origHeight = metadata.height
      newDetails.origWidth = metadata.width
      return imgProc.originalImage(fname, dir, destDir)
    })
    .then(() => {
      data = fse.readJsonSync(dir+'/details.json')
      data[fname] = newDetails
      fse.writeJsonSync(dir+'/details.json', data)
      return data
    })
    .then(data => {
      renderData.images = data
      res.render('admin/images', renderData)
    })
    .catch(err => {
      console.error(err)
      data[fname] = newDetails
      fse.writeJsonSync(dir+'/details.json', data)
      renderData.images = data
      res.render('admin/images', renderData)
    })
})

// READ (GET)
router.get('/:dir/:name', (req, res) => {
  const dir = imgSrcDir + req.url

  let renderData = {
    "images" : "", 
    "path" : req.url, 
    "folder" : req.params.name
  }

  fse.readJson(dir+'/details.json')
    .then(data => {
      renderData.images = data
      res.render('admin/images', renderData)
    })
    .catch(error => {
      res.render('admin/images', renderData)
    })
})

// UPDATE (PUT)
router.put('/:series/:dir/:name', upload.none(), (req, res) => {
  const dir = `${imgSrcDir}/series/${req.params.dir}`
  const destDir = `${imgDestDir}/series/${req.params.dir}`

  const fname = req.params.name

  let renderData = {
    "fname" : req.params.name, 
    "path" : `/${req.params.series}/${req.params.dir}`, 
    "folder" : path.parse(req.params.dir).name
  }

  const data =  fse.readJsonSync(dir+'/details.json')
  data[fname].alt = req.body.alt
  data[fname].extractWidth = parseInt(req.body.extractWidth)
  data[fname].extractHeight = parseInt(req.body.extractHeight) 
  data[fname].extractLeft = parseInt(req.body.extractLeft) || 0
  data[fname].extractTop = parseInt(req.body.extractTop) || 0
  data[fname].resizeWidth = parseInt(req.body.resizeWidth)
  data[fname].resizeHeight = parseInt(req.body.resizeHeight)
  data[fname].rotate = parseInt(req.body.rotate)
  data[fname].sharpen = parseInt(req.body.sharpen)
  
  console.log(data[fname].extractWidth)
  console.log(data[fname].extractHeight)
  // Make Sure Extract Region Is Not Too Large
  data[fname].extractWidth =  (data[fname].extractWidth + data[fname].extractLeft) > data[fname].origWidth ? 
                              (data[fname].origWidth - data[fname].extractLeft) : data[fname].extractWidth
  data[fname].extractHeight =  (data[fname].extractHeight + data[fname].extractTop) > data[fname].origHeight ? 
                              (data[fname].origHeight - data[fname].extractTop) : data[fname].extractHeight

  console.log(data[fname].extractWidth, data[fname].extractHeight)

  if ( (data[fname].extractHeight && data[fname].extractWidth) || 
        data[fname].resizeHeight || data[fname].resizeWidth || 
        data[fname].rotate || data[fname].sharpen) {
    data[fname].modified = true
  } else {
    data[fname].modified = false
  }

  fse.writeJsonSync(dir+'/details.json', data)

  renderData.object = data[fname]

  if (data[fname].modified) {
    imgProc.modifyImage(fname, dir, 
                    destDir,data[fname].extractHeight, data[fname].extractWidth, 
                    data[fname].extractLeft, data[fname].extractTop, 
                    data[fname].resizeHeight, data[fname].resizeWidth, 
                    data[fname].rotate, data[fname].sharpen)
      .then( () => {
        console.log(req.body)
        res.render('admin/components/image-edit', renderData)
      })
      .catch(err => {
        console.error(err.message)
      })
  } else {
    res.send('no change')
  }
})

// DELETE 
router.delete('/:series/:dir/:name', (req, res) => {
  const dir = `${imgSrcDir}/series/${req.params.dir}`
  const destDir = `${imgDestDir}/series/${req.params.dir}`
  const fname = req.params.name

  let renderData = {
    "images" : "", 
    "path" : req.url, 
    "folder" : req.params.name
  }
  let resized = false

  const data =  fse.readJsonSync(dir+'/details.json')
  if (data[fname].resizeHeight || data[fname].resizeWidth) {
    resized = true
  }
  delete(data[fname])
  renderData.images = data
  fse.writeJsonSync(dir+'/details.json', data)

  res.send('ok')

  fse.rm(dir+'/original/'+fname)
  fse.rm(dir+'/original/thumb/'+fname)
  fse.rm(destDir+'/'+path.parse(fname).name+'.webp')
  fse.rm(dir+'/modify/'+fname)
    .catch(err => {
      console.error(err.message)
    })
  fse.rm(dir+'/modify/thumb/'+fname)
    .catch(err => {
      console.error(err.message)
    })
})

// UTILITY FUNCTIONS
async function getMetadata(image) {
  try {
    const metadata = await sharp(image).metadata();
    console.log(metadata);
  } catch (error) {
    console.log(`An error occurred during processing: ${error}`);
  }
}

module.exports = router