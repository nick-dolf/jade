const fs = require('fs')
const path = require('path')
const sass = require('sass')

function renderSass() {
  const main = path.join(process.cwd(), 'src/sass/main.scss')
  const style = path.join(process.cwd(), 'site/assets/css/style.css')

  const result = sass.compile(main)

  fs.writeFile(style, result.css.toString(), (err) => {
    if (err) console.error(err.message);
  })
}

function getSeriesPages() {
  const folder = path.join(process.cwd(), 'src/pages/series')
  
  const files =  fs.readdirSync(folder)
  
  return files.map(file => {
    return path.parse(file).name
  })


}

module.exports = { renderSass, getSeriesPages };
