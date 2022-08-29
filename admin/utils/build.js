const fs = require('fs')
const path = require('path')
const sass = require('sass')

function renderSass() {
  const main = path.join(process.cwd(), './src/sass/main.scss')
  const style = path.join(process.cwd(), './site/assets/css/style.css')

  sass.render({ file: main}, (err, result) => {
    if (err) {
      console.error(err.message)
    } else {
      fs.writeFile(style, result.css.toString(), (err) => {
        if (err) console.error(err.message);
      })
    }
  })
}

module.exports = { renderSass };
