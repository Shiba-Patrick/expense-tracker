const express = require('express')
const router = express.Router()
const passport = require('passport')
const Record = require('../../models/record')
const User = require('../../models/user')

//login page
router.get('/login', (req, res) => {
  res.render('login')
})

//passport login
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
}))

// logout
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/users/login')
})

//register page
router.get('/register', (req, res) => {
  res.render('register')
})

//post register
router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body

  //error status
  if (!email || !password || !confirmPassword) {
    console.log('請確認是否有無填寫的欄位!!!')
    res.redirect('/users/register')
  }
  if (password !== confirmPassword) {
    console.log('密碼與確認密碼不相符!!!')
    res.redirect('/users/register')
  }
  User.findOne({ email })
    .then(user => {
      if (user) {
        console.log('這個信箱註冊過了喔!!!')
        return res.render('register', { name, email })
      } else {
        return User.create({
          name,
          email,
          password
        })
          .then(() => res.redirect('login'))
          .catch(error => console.log(error))
      }
    })
    .catch(error => console.log(error))
})

module.exports = router