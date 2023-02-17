const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
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
      .catch(error => done(error))
  }))
  // Facebook login setting
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID, //應用程式編號
    clientSecret: process.env.FACEBOOK_SECRET, //應用程式密鑰
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  }, (accessToken, refreshToken, profile, done) => {
    const { name, email } = profile._json
    User.findOne({ email })
      .then(user => {
        if (user) return done(null, user)

        const randomPassword = Math.random().toString(36).slice(-8) //1-10+a-z=36後裁切8個字母

        bcrypt
          .genSalt(10)  // 產生「鹽」，並設定複雜度係數為 10
          .then(salt => bcrypt.hash(randomPassword, salt)) // 為使用者密碼「加鹽」，產生雜湊值
          .then(hash => User.create({
            name,
            email,
            password: hash // 用雜湊值取代原本的使用者密碼
          }))
          .then(user => done(null, user))
          .catch(err => done(err, false))
      })
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