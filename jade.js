const PORT = 3013
const express = require('express')
const app = express()
module.exports = app
const build = require('./admin/utils/build')
require('dotenv').config()
const marked = require('marked')
marked.setOptions({ breaks: true })
const path = require('path')
const sanitizeHtml = require('sanitize-html')

// Set up Development Environment
if (process.env.NODE_ENV === 'development') {
  console.log("\nDev environment")

  // On production this will be served by NGINX
  app.use(express.static('site'))
 
  // Live Reload
  const livereload = require('livereload')
  const liveReloadServer = livereload.createServer()
  liveReloadServer.watch(path.join(__dirname, 'site'))

  const connectLivereload = require('connect-livereload')
  app.use(connectLivereload())

  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });

  // Make html easy to read
  app.locals.pretty = true;
} else if (process.env.NODE_ENV === 'staging') {

}

// Set up Template Engine
app.set('view engine', 'pug');
app.set('views', path.join(process.cwd(), 'src/views'))
// Convert Markdown and sanitize the HTML
app.locals.md = (data) => {
  return sanitizeHtml(marked.parse(data))
}
app.locals.site = {}
app.locals.site.baseURL = process.env.BASE_URL || ""
app.locals.site.series = build.getSeriesPages()

console.log(app.locals)

app.use('/', (req, res, next) => {
  console.log(req.url)
  next();
})

// Build
build.renderSass();

// Set up routes
app.use('/admin', require('./admin/routes/admin'))

app.listen(PORT, () => {console.log(`listening on ${PORT}...`)})
