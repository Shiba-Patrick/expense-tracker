const express = require('express')
const session = require('express-session')
const express_hbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const routes = require('./routes')

// 載入設定檔，要寫在 express-session 以後
const usePassport = require('./config/passport')

require('./config/mongoose')//load config mongoose
// 非正式環境下使用dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const port = process.env.PORT

//handlebars模板引勤
app.engine('handlebars', express_hbs({ defaultLayout: 'main' })) 
app.set('view engine', 'handlebars') 

app.use(session({
  secret: 'PatrickCode0214',
  resave: false,
  saveUninitialized: true,
}))

app.use(bodyParser.urlencoded({ extended: true })) //連結post傳入
app.use(methodOverride('_method'))//解構CRUD

usePassport(app)
//呼叫flash套件:並設定成功與警告訊息框
app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.error_msg = req.flash('error')
  next()
})
app.use(routes)

app.listen(port, () => {
  console.log(`App is listening on http://localhost:${port}`)
})