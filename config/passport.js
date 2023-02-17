const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

module.exports = app => {
  // middleware初始化
  app.use(passport.initialize());
  app.use(passport.session());

  // Local登入策略:新增passReqToCallback: true
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false)
        }
        if (user.password !== password) {
          return done(null, false)
        }
        return done(null, user);
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