const PORT = 3013
const express = require('express')
const app = express()
require('dotenv').config()

// Set up Different Environments
if (process.env.NODE_ENV === 'development') {
  console.log("\nDev environment")
  app.use(express.static('site'))
} else if (process.env.NODE_ENV === 'staging') {
  console.log("\n Staging environment")
}

app.get('/admin', (req, res) => {
  res.send('Hello world from the admin, this is ' + process.env.NODE_ENV + ' environment')
})

app.listen(PORT, () => {console.log(`listening on ${PORT}...`)})
