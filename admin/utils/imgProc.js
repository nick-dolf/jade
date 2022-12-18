const sharp = require('sharp')
const fse = require('fs-extra')
const path = require('path')

async function modifyImage(img, dir, destDir, eHeight, eWidth, eLeft, eTop, rHeight, rWidth, rotate, sharpen) {
  fse.mkdirs(dir+'/modify/')
  fse.mkdirs(dir+'/modify/thumb/')
  fse.mkdirs(destDir)

  let image =  await sharp(dir+'/original/'+img).toBuffer()
    
  // Extract
  if(eHeight && eWidth) {
    image = await sharp(image).extract({
      width: eWidth,
      height: eHeight,
      left: eLeft,
      top: eTop,
    }).toBuffer()
  }

  // Resize Step
  image = await sharp(image).resize({
      height: (rHeight > 0 ? rHeight : null),
      width: (rWidth > 0 ? rWidth : null)
    })
    .rotate(rotate > 0 ? rotate : null)
    .toBuffer()

  // Optional Sharpen
  if (sharpen) {
    console.log('sharpening')
    image = await sharp(image).sharpen({
      sigma: 1,
      m1: 0,
      m2: 3,
      x1: 3,
      y2: 10,
      y3: 20,
    }).toBuffer()
  }

  await sharp(image).webp().toFile(destDir+'/'+path.parse(img).name+'.webp')

  await sharp(image).toFile(dir+'/modify/'+img)

  await sharp(image)
    .resize({
      width: 200, 
      height:200, 
      fit: 'contain',
      background: '#FFF'
    })
      .toFile(dir+'/modify/thumb/'+img)
}

async function originalImage(img, srcDir, destDir) {
  await fse.mkdirs(srcDir+'/original/thumb/')
  await fse.mkdirs(srcDir+'/modify/thumb/')
  await fse.mkdirs(destDir)

  const image =  await sharp(srcDir+'/original/'+img).toBuffer()

  const name = path.parse(img).name
  await sharp(image).webp().toFile(destDir+'/'+name+'.webp')

  const thumb = await sharp(image)
    .resize({
      width: 200, 
      height:200, 
      fit: 'contain',
      background: '#FFF'
    })
    .toBuffer()

    await sharp(thumb).toFile(srcDir+'/original/thumb/'+img)
    await sharp(thumb).toFile(srcDir+'/modify/thumb/'+img)
}

module.exports = { modifyImage, originalImage }