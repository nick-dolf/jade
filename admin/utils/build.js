const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const sass = require('sass')
const sharp = require('sharp')

const imgSrcDir = path.join(process.cwd(), 'assets/images')
const imgDestDir = path.join(process.cwd(), 'site/assets/images')
const pageDir = path.join(process.cwd(), 'src/pages')

function renderSass() {
  const main = path.join(process.cwd(), 'src/sass/main.scss')
  const style = path.join(process.cwd(), 'site/assets/css/style.css')

  const result = sass.compile(main, {style:"compressed"})

  fs.writeFile(style, result.css.toString(), (err) => {
    if (err) console.error(err.message);
  })
}

function getPages() {
  return getPagesRec(pageDir)
}

async function getPagesRec(dir) {
  let pages = []
  const entries = await fse.readdir(dir, {withFileTypes: true})

  for (var i = 0; i < entries.length; i++) {
    if(entries[i].isFile()) {
      pages.push(entries[i].name)
    } else {
      let subPages = await getPagesRec(dir+"/"+entries[i].name)
      subPages.forEach(subPage => {
        pages.push(entries[i].name+"/"+subPage)
      })
    }
  }

  return pages
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
      width: 1400,
      height: 800
    })
    .jpeg()
    .toFile(destImage+'-1400w.jpg')
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

function processGridImage(imgName, imgDetails, dir, width, height) {
  let srcImage = imgSrcDir+dir+'/original/'+imgName
  if (imgDetails.modified) {
    srcImage = imgSrcDir+dir+'/modify/'+imgName
  }
  const destImage = imgDestDir+dir+'/'+imgName.replace(/\.[^.]+$/, '')

  sharp(srcImage)
    .webp()
    .toFile(destImage+'-modal.webp')
    .catch(err => {
    console.error(err.message)
  })

  sharp(srcImage)
    .jpeg()
    .toFile(destImage+'-modal.jpg')
    .catch(err => {
    console.error(err.message)
  })

  sharp(srcImage)
    .resize({
      width: 460,
      height: height,
    })
    .webp()
    .toFile(destImage+'-460w.webp')
    .catch(err => {
    console.error(err.message)
  })

  sharp(srcImage)
    .resize({
      width: 460,
      height: height,
    })
    .jpeg()
    .toFile(destImage+'-460w.jpg')
    .catch(err => {
    console.error(err.message)
  })

  sharp(srcImage)
    .resize({
      width: 341,
      height: Math.round((341/460)*height),
    })
    .webp()
    .toFile(destImage+'-341w.webp')
    .catch(err => {
    console.error(err.message)
  })

}

function processMenuImage(imgName, imgDetails, dir) {
  let srcImage = imgSrcDir+dir+'/original/'+imgName
  if (imgDetails.modified) {
    srcImage = imgSrcDir+dir+'/modify/'+imgName
  }
  const destImage = imgDestDir+dir+'/'+imgName.replace(/\.[^.]+$/, '')


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

  sharp(srcImage)
    .resize({
      width: 1100,
      height: 825
    })
    .jpeg()
    .toFile(destImage+'-1100w.jpg')
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


module.exports = { renderSass, getPages, getSeriesPages, processImage, processGridImage, toModalColor, processMenuImage };
