const cookieSession = require('cookie-session')
const express = require('express')
const router = express.Router()
router.use(express.urlencoded({extended: false}))
router.use(cookieSession({
  name: 'session',
  keys: [process.env.SECRET_KEY_1, process.env.SECRET_KEY_2],
  maxAge: 120 * 60 * 60 * 1000
}))

const user = {
  name: process.env.USER,
  password: process.env.PASS
}

router.get('/', (req, res) => {
  res.send('Hello world from the admin, this is ' + process.env.NODE_ENV + ' environment')
})

module.exports = router
