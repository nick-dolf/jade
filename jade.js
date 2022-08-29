const PORT = 3013
const express = require('express')
const app = express()
const build = require('./admin/utils/build')
require('dotenv').config()
const marked = require('marked')
marked.setOptions({ breaks: true })
const path = require('path')
const sanitizeHtml = require('sanitize-html')

// Set up Different Environments
if (process.env.NODE_ENV === 'development') {
  console.log("\nDev environment")
  app.use(express.static('site'))
} else if (process.env.NODE_ENV === 'staging') {
  console.log("\n Staging environment")
}

// Set up Template Engine
app.set('view engine', 'pug');
app.set('views', path.join(process.cwd(), 'src/views'))
app.locals.pretty = true;
// Convert Markdown and sanitize the HTML
app.locals.md = (data) => {
  return sanitizeHtml(marked.parse(data))
}


// Build
build.renderSass();

// Set up routes
app.use('/admin', require('./admin/routes/admin'))

app.listen(PORT, () => {console.log(`listening on ${PORT}...`)})
