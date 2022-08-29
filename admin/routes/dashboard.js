const path = require('path')
const fs = require('fs')
const express = require('express')
const router = express.Router()

const pageDir = path.join(process.cwd(), 'src/pages')

// Read GET
router.get('/', (req, res) => {
  let pageData = {heading: 'Dashboard',pages: []}

  fs.promises.readdir(pageDir + "/series", { withFileTypes: true })
    .then(dirEntries => {
      dirEntries.forEach(entry => {
        if (entry.isFile()) {
          pageData.pages.push(path.parse(entry.name).name)
        }
      })
      res.render('admin/dashboard', pageData)
    })
    .catch(err => {
      console.error(err.message)
      res.status(404).render('404')
    })
})


module.exports = router
