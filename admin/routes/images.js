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
router.post('/*', upload.single('pic'),(req, res) => {
  const dir = imgSrcDir + req.url
  const destDir = imgDestDir + req.url
  const fname = slugify(req.file.filename)
  const params = req.url.split('/')

  let renderData = {
    "images" : "", 
    "path" : req.url, 
  }
  if (params.length == 2) {
    renderData.folder = params[1]
  } else {
    renderData.folder = params[2]
  }

  let data = {}
  let newDetails = {}
  newDetails.alt = req.body.alt
  
  sharp(req.file.path).metadata()
    .then(metadata => {
      newDetails.origHeight = metadata.height
      newDetails.height = metadata.height
      newDetails.origWidth = metadata.width
      newDetails.width = metadata.width
      newDetails.modified = false
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
      res.redirect('back')
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
router.get('/*', (req, res) => {
  const dir = imgSrcDir + req.url
  const params = req.url.split('/')

  let renderData = {
    "images" : "", 
    "path" : req.url, 
  }
  if (params.length == 2) {
    renderData.folder = params[1]
  } else {
    renderData.folder = params[2]
  }

  fse.readJson(dir+'/details.json')
    .then(data => {
      renderData.images = data
      res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
      res.render('admin/images', renderData)
    })
    .catch(error => {
      res.render('admin/images', renderData)
    })
})

// UPDATE (PUT)
router.put('/*', upload.none(), (req, res) => {
  const dir = imgSrcDir + req.url.substring(0, req.url.lastIndexOf('/'))
  const destDir = imgDestDir + req.url.substring(0, req.url.lastIndexOf('/'))
  const fname = req.url.substring(req.url.lastIndexOf('/')+1)
  const params = req.url.split('/')

  let renderData = {
    "fname" : fname,
    "images" : "", 
    "path" : req.url.substring(0, req.url.lastIndexOf('/')), 
  }
  if (params.length == 2) {
    renderData.folder = params[1]
  } else {
    renderData.folder = params[2]
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

  // Reset 
  data[fname].modified = false
  data[fname].height = data[fname].origHeight
  data[fname].width = data[fname].origWidth

  if (data[fname].extractHeight && data[fname].extractWidth) {
    // Make Sure Extract Region Is Not Too Large
    data[fname].extractWidth =  (data[fname].extractWidth + data[fname].extractLeft) > data[fname].origWidth ? 
                                (data[fname].origWidth - data[fname].extractLeft) : data[fname].extractWidth
    data[fname].extractHeight =  (data[fname].extractHeight + data[fname].extractTop) > data[fname].origHeight ? 
                                (data[fname].origHeight - data[fname].extractTop) : data[fname].extractHeight

    data[fname].height = data[fname].extractHeight
    data[fname].width = data[fname].extractWidth
    data[fname].modified = true
  }
  
  // calculate final image height width from resize
  if (data[fname].resizeHeight && data[fname].resizeWidth) {
    data[fname].height = data[fname].resizeHeight
    data[fname].width = data[fname].resizeWidth
    data[fname].modified = true
  } else if (data[fname].resizeWidth) {
    data[fname].height = Math.round((data[fname].resizeWidth /data[fname].width) * data[fname].height)

    data[fname].width = data[fname].resizeWidth
    data[fname].modified = true
  } else if (data[fname].resizeHeight) {
    data[fname].width = Math.round((data[fname].resizeHeight /data[fname].height) * data[fname].width)

    data[fname].height = data[fname].resizeHeight
    data[fname].modified = true
  }

  if (data[fname].rotate || data[fname].sharpen) {
    data[fname].modified = true
  }

  fse.writeJsonSync(dir+'/details.json', data)
  console.log(data[fname])

  renderData.object = data[fname]

  if (data[fname].modified) {
    imgProc.modifyImage(fname, dir, 
                    destDir,data[fname].extractHeight, data[fname].extractWidth, 
                    data[fname].extractLeft, data[fname].extractTop, 
                    data[fname].resizeHeight, data[fname].resizeWidth, 
                    data[fname].rotate, data[fname].sharpen)
      .then( () => {
        res.render('admin/components/image-edit', renderData)
      })
      .catch(err => {
        console.error(err.message)
      })
  } else {
    res.render('admin/components/image-edit', renderData)
  }
})

// DELETE 
router.delete('/*', (req, res) => {
  const dir = imgSrcDir + req.url.substring(0, req.url.lastIndexOf('/'))
  const destDir = imgDestDir + req.url.substring(0, req.url.lastIndexOf('/'))
  const fname = req.url.substring(req.url.lastIndexOf('/')+1)

  let renderData = {
    "images" : "", 
    "path" : req.url, 
  }

  const data =  fse.readJsonSync(dir+'/details.json')

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

module.exports = router