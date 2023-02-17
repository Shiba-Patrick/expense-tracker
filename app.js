const express = require('express')
const express_hbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const session = require('express-session')
const routes = require('./routes')
const usePassport = require('./config/passport')

require('./config/mongoose')//load config mongoose
// 非正式環境下使用dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const port = process.env.PORT

app.engine('handlebars', express_hbs({ defaultLayout: 'main' })) //handlebars模板引勤
app.set('view engine', 'handlebars') //handlebars模板引勤
app.use(bodyParser.urlencoded({ extended: true })) //連結post傳入
app.use(methodOverride('_method'))//解構CRUD

app.use(session({
  secret: 'PatrickCode0214',
  resave: false,
  saveUninitialized: true,
}))

usePassport(app)
app.use(routes)

app.listen(port, () => {
  console.log(`App is listening on http://localhost:${port}`)
})