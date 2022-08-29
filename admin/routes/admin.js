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

router.get('/login', (req, res) => {
  res.render('admin/login', { heading: 'Login' })
})

router.use((req, res, next) => {
  if (req.session.loggedin) {
    next()
  } else {
    req.session.original = req.url
    res.redirect('/admin/login')
  }
})

router.get('/', (req, res) => {
  res.redirect('/admin/dashboard')
})

router.use('/dashboard', require('./dashboard'))
router.use('/pages', require('./pages'))
router.use('/src/assets', express.static('src/assets'))

module.exports = router
