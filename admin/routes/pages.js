const path = require('path')
const fsPromises = require('fs').promises
const fse = require('fs-extra')
const multer = require('multer')
const upload = multer()
const app = require('../../jade')
const slugify = require('slugify')
const express = require('express')
const router = express.Router()
router.use(express.urlencoded({extended: true}))
router.use(express.json())

const pageDir = path.join(process.cwd(), 'src/pages/')
const siteDir = path.join(process.cwd(), 'site/')
const imageDir = path.join(process.cwd(), 'src/assets/images/')

// Create Post
router.post('/:path', (req, res) => {
  console.log(req.body)
  const fileName = slugify(req.body.name, {lower: true})
  console.log(req.params.path)

  const pageData = {
    name: req.body.name,
    title: req.body.name,
    description: '',
    path: '/'+req.params.path+'/'+fileName,
    template: 'series',
  }

  // Save Page Data in JSON
  fse.outputJson(pageDir+pageData.path+'.json', pageData)
    .then(() => {
      res.send('success')
    })
    .catch(err => {
      console.error(err.message)
    })

    renderPage(pageData)
})

// Read GET
router.get('/:name', (req, res) => {
  const page = req.params.name

  let pageData = {}
  fsPromises.readFile(pageDir + page + '.json')
    .then(data => {
      pageData = JSON.parse(data)
    })
    .then(() => {
      return fsPromises.readdir(imageDir + page + "/thumb/")
    })
    .then((images) => {
      pageData.images = images
      res.render('admin/' + pageData.template, pageData)
    })
    .catch(err => {
      console.error(err.message)
      res.status(404).render('404')
    })
})

router.get('/:dir/:name', (req, res) => {
  const page = req.params.dir + "/" + req.params.name

  fsPromises.readFile(pageDir + page +'.json')
    .then(data => {
      const pageData = JSON.parse(data)
      res.render('admin/' + pageData.template, pageData)
    })
    .catch(err => {
      console.error(err.message)
      res.status(404).render('404')
    })
})

// Update PUT
router.put('/*', upload.none(), (req, res) => {
  let page = req.url.slice(1)
  if(!page) page = 'home'
  console.log(page)
  fsPromises.readFile(pageDir + page + '.json')
    .then(data => {
      const pageData = JSON.parse(data)
      const keys = Object.keys(req.body)

      keys.forEach((key, i) => {
        pageData[key] = req.body[key]
      })
      renderPage(pageData)
      return(JSON.stringify(pageData))
    })
    .then(data => fsPromises.writeFile(pageDir + page + '.json', data))
    .catch(err => {
      console.error(err.message)
    })

  res.send('ok')
})

// Delete DELETE
router.delete('/:dir/:name', (req, res) => {
  const page = req.params.dir + "/" + req.params.name

  fsPromises.rm(pageDir + page + '.json')
    .then(() => {
      res.send(page)
    })
    .catch(err => {
      console.error(err.message)
    })
})

// Utility
function renderPage(page) {
  let destination =""
  if (page.path === '/') {
    destination = siteDir + "/index.html"
  } else {
    destination = siteDir + page.path + "/index.html"
  }

  app.render("site/" + page.template, page, (err, html) => {
    if (err) {
      console.error(err.message)
    } else {
      fse.outputFile(destination, html)
        .catch(err => {
          console.error(err.message)
        })
    }
  })
}

module.exports = router
