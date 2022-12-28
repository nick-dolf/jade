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

  const keys = Object.keys(req.body)
  let data = fse.readJsonSync(pageDir + page + '.json')
  let pageData = data
  pageData.page = page

  keys.forEach((key, i) => {
    pageData[key] = req.body[key]
  })

  fse.writeJsonSync(pageDir + page + '.json', data)

  fse.readJson(imageDir + page + '/details.json')
    .then(data => {
      pageData.images = data
      renderPage(pageData)
      res.send('ok')
    })
    .catch(() => {
      renderPage(pageData)
      console.log(req.body)
      setTimeout(() => {

        res.send('ok')
      }, 3000)
    })

  // page specific css
  const css = `:root {
    --text-color: ${req.body.textColor};
    --link-color: ${req.body.linkColor};
    --link-hover-color: ${req.body.linkHoverColor};
    --modal-color: #000;
    background-image: linear-gradient(${req.body.topColor}, ${req.body.bottomColor});
  }`

  fse.outputFile(`${siteDir}assets/css/${page}.css`, css)

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
