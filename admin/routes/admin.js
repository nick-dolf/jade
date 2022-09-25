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
  name: process.env.APP_USER,
  password: process.env.APP_PASS
}

router.use('/src/assets/css', express.static('src/assets/css'))

router.get('/login', (req, res) => {
  res.render('admin/login', { heading: 'Login' })
})

router.post('/login', (req, res) => {
  if (req.body.email === user.name && req.body.password === user.password) {
    req.session.loggedin = true;
    res.redirect(process.env.BASE_URL + '/admin/dashboard')
  } else {
    res.render('admin/login', { heading: 'Login', warning: 'incorrect credentials' })
  }
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
  res.redirect(process.env.BASE_URL + '/admin/dashboard')
})

router.use('/dashboard', require('./dashboard'))
router.use('/pages', require('./pages'))
router.use('/images', require('./images'))
router.use('/src/assets/images', express.static('src/assets/images'))
router.use('/src/assets/js', express.static('src/assets/js'))

module.exports = router
