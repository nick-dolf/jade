const fsPromises = require('fs').promises
const path = require('path')

const imageDir = path.join(process.cwd(), 'src/assets/images/')

function getFileNames(dir) {

}

function readJSONFile(file) {
  fsPromises.readFile(file)
    .then(data => {
      return JSON.parse(data)
    })
}

module.exports = { getFileNames, readJSONFile }