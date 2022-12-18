const path = require('path')
const fsPromises = require('fs').promises
const fse = require('fs-extra')
const multer = require('multer')
const upload = multer()
const app = require('../../jade')
const build = require('../utils/build')
const slugify = require('slugify')
const express = require('express')
const router = express.Router()
router.use(express.urlencoded({extended: true}))
router.use(express.json())

const pageDir = path.join(process.cwd(), 'src/pages/')
const siteDir = path.join(process.cwd(), 'site/')
const imageDir = path.join(process.cwd(), 'assets/images/')

// CREATE (POST)
router.post('/:path', (req, res) => {
  if(req.body.name != "") {
    const fileName = slugify(req.body.name, {lower: true})

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
  } else {
    res.send('Page name cannot be blank')
  }
})

// READ (GET)
router.get('*', (req, res) => {
  const page = req.url

  let pageData = {}
  let images = {}
  fse.readJson(imageDir + page + "/details.json")
    .then((data) => {
      images = data
    })
    .catch(() =>{
      images = {}
    })
    .then(() => {
      return fse.readJson(pageDir + page + '.json')
    })
    .then(data => {
      pageData = data
      pageData.images = images
      pageData.seriesPages = build.getSeriesPages()
      res.render('admin/' + pageData.template, pageData)
    })
    .catch(err => {
      console.error(err.message)
      res.status(404).render('404')
    })
})

// UPDATE (PUT)
router.put('/*', upload.none(), (req, res) => {
  let page = req.url.slice(1)
  if(!page) page = 'home'

  fsPromises.readFile(pageDir + page + '.json')
    .then(data => {
      const pageData = JSON.parse(data)
      const keys = Object.keys(req.body)

      keys.forEach((key, i) => {
        pageData[key] = req.body[key]
      })
      console.log(pageData)
      renderPage(pageData)
      return(JSON.stringify(pageData))
    })
    .then(data => fsPromises.writeFile(pageDir + page + '.json', data))
    .catch(err => {
      console.error(err.message)
    })

  res.send('ok')
})

// DELETE
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
