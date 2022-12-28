const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const sass = require('sass')
const sharp = require('sharp')

const imgSrcDir = path.join(process.cwd(), 'assets/images')
const imgDestDir = path.join(process.cwd(), 'site/assets/images')

function renderSass() {
  const main = path.join(process.cwd(), 'src/sass/main.scss')
  const style = path.join(process.cwd(), 'site/assets/css/style.css')

  const result = sass.compile(main, {style:"compressed"})

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

function processImage(imgName, imgDetails, path) {
  let srcImage = imgSrcDir+path+'/original/'+imgName
  if (imgDetails.modified) {
    srcImage = imgSrcDir+path+'/modify/'+imgName
  }
  const destImage = imgDestDir+path+'/'+imgName.replace(/\.[^.]+$/, '')


  sharp(srcImage)
    .resize({
      width: 1400,
      height: 800
    })
    .webp()
    .toFile(destImage+'-1400w.webp')
    .catch(err => {
    console.error(err.message)
  })

  sharp(srcImage)
    .resize({
      width: 1050,
      height: 600
    })
    .webp()
    .toFile(destImage+'-1050w.webp')
    .catch(err => {
    console.error(err.message)
  })

  sharp(srcImage)
    .resize({
      width: 700,
      height: 400
    })
    .webp()
    .toFile(destImage+'-700w.webp')
    .catch(err => {
    console.error(err.message)
  })

  sharp(srcImage)
    .resize({
      width: 350,
      height: 200
    })
    .webp()
    .toFile(destImage+'-350w.webp')
    .catch(err => {
    console.error(err.message)
  })

}

function processGridImage(imgName, imgDetails, path, width, height) {
  let srcImage = imgSrcDir+path+'/original/'+imgName

  const destImage = imgDestDir+path+'/'+imgName.replace(/\.[^.]+$/, '-460.webp')

  sharp(srcImage)
    .resize({
      width: width,
      height: height,
    })
    .webp()
    .toFile(destImage)
    .catch(err => {
    console.error(err.message)
  })

}

function processMenuImage(imgName, imgDetails, path) {
  let srcImage = imgSrcDir+path+'/original/'+imgName
  if (imgDetails.modified) {
    srcImage = imgSrcDir+path+'/modify/'+imgName
  }
  const destImage = imgDestDir+path+'/'+imgName.replace(/\.[^.]+$/, '')

  sharp(srcImage)
    .resize({
      width: 1100,
      height: 825
    })
    .webp()
    .toFile(destImage+'-1100w.webp')
    .catch(err => {
    console.error(err.message)
  })

  sharp(srcImage)
    .resize({
      width: 800,
      height: 600
    })
    .webp()
    .toFile(destImage+'-800w.webp')
    .catch(err => {
    console.error(err.message)
  })

  sharp(srcImage)
    .resize({
      width: 400,
      height: 300
    })
    .webp()
    .toFile(destImage+'-400w.webp')
    .catch(err => {
    console.error(err.message)
  })


}

function toModalColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  return `rgba(${r},${g},${b}, 0.9)`
}


module.exports = { renderSass, getSeriesPages, processImage, processGridImage, toModalColor, processMenuImage };
