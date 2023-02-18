const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('../../models/user')

//login page
router.get('/login', (req, res) => {
  res.render('login')
})

//passport login
router.post('/login', (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    req.flash('warning_msg', '請再次確認您的信箱與密碼是否都有填寫')
    return res.redirect('/users/login')
  }
  next()
},
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  }))

// logout
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '您已成功登出!!!')
  res.redirect('/users/login')
})

//register page
router.get('/register', (req, res) => {
  res.render('register')
})

//post register
router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  //error status
  if (!email || !password || !confirmPassword) {
    errors.push({ message: '請確認是否有無填寫的欄位!!!' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符!!!' })
  }
  if (errors.length) {
    return res.render('register', { errors, name, email })
  }
  User.findOne({ email })
    .then(user => {
      if (user) {
        errors.push({ message: '這個信箱已經被註冊過了喔!!!' })
        return res.render('register', { errors, name, email })
      }
      return bcrypt.genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({
          name,
          email,
          password: hash
        }))
        .then(() => res.redirect('login'))
        .catch(error => console.log(error))
    })
    .catch(error => console.log(error))
})

module.exports = router