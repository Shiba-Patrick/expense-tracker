const express = require('express')
const express_hbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Record = require('./models/record')

// 非正式環境下使用dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// mongoose setting
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('mongoDB error!!!!!!!')
})
db.once('open', () => {
  console.log('mongoDB connected!!!')
})

const app = express()
const port = 3000

//handlebars模板引勤
app.engine('handlebars', express_hbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true })) //連結post傳入

//home page
app.get('/', (req, res) => {
  Record.find()
    .lean()
    .sort({ _id: 'asc' })
    .then(items => {
      items.forEach(item => {
        item.date = item.date.toISOString().slice(0, 10)
      })
      console.log(items)//test
      return items
    })
    .then(records => {
      res.render('index', { records })
    })
    .catch(error => console.log(error))
})

//new page
app.get('/new', (req, res) => {
  res.render('new')
})

//post new table
app.post('/new', (req, res) => {
  const body = req.body
  console.log(body)//test
  Record.create({
    name: body.name,
    date: body.date,
    category: body.category,
    cost: body.cost
  })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//edit page
app.get('/edit', (req, res) => {
  res.render('edit')
})

//post edit table
app.post('/edit', (req, res) => {
  const body = req.body
  console.log(body) //test
  res.render('edit', { body })
})

//delete function
app.get('/delete', (req, res) => {
  res.redirect('/')
})

app.listen(port, () => {
  console.log(`App is listening on http://localhost:${port}`)
})