const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/user')

module.exports = app => {
  // middleware初始化
  app.use(passport.initialize());
  app.use(passport.session());

  // Local登入策略:新增passReqToCallback: true
  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false, req.flash('warning_msg', '這個mail沒有註冊過喔'))
        }
          return (bcrypt.compare(password, user.password))
           .then(isMatch => {
            if(!isMatch){
              return done(null, false, req.flash('warning_msg', '密碼不對喔!!!'))
            }
             return done(null, user);
           })
        })
      .catch(error => console.log(error))
  }))

  // 設定序列化與反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(error => done(error))
  })
}