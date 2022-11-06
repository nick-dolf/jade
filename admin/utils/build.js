const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const sass = require('sass')
const sharp = require('sharp')

const imgSrcDir = path.join(process.cwd(), 'src/assets/images')
const imgDestDir = path.join(process.cwd(), 'site/assets/images')

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

function processImage(path, img, width, height) {
  console.log(imgSrcDir + path)
  console.log(imgDestDir + path)

  fse.mkdirs(imgDestDir + path)

  sharp(imgSrcDir+path+'/original/'+img)
    // .resize({
    //   width: width,
    //   height: height
    // })
    .jpeg( {quality: 90})
    .toFile(imgDestDir+path+'/'+img)

    .catch(err => {
    console.error(err.message)
  })

}

module.exports = { renderSass, getSeriesPages, processImage };
