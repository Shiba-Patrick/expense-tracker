const express = require('express')
const express_hbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const methodOverride = require('method-override')

const Record = require('./models/record')
const Category = require('./models/category')
const app = express()
const port = 3000

// 非正式環境下使用dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// mongoose setting
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('mongoDB error!!!!!!!')
})
db.once('open', () => {
  console.log('mongoDB connected!!!')
})

//handlebars模板引勤
app.engine('handlebars', express_hbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true })) //連結post傳入
app.use(methodOverride('_method'))//解構CRUD

//home page
app.get('/', async (req, res) => {
  let totalAmount = 0
  const items = await Record.find().lean().sort({ _id: 'asc' })
  const records = await Promise.all(items.map(async (item) => {
    const category = await Category.findOne({ _id: item.categoryId })
    item.categoryIcon = category.icon
    item.date = item.date.toISOString().slice(0, 10)
    totalAmount += item.cost
    return item
  }))
  records.totalAmount = totalAmount
  res.render('index', { records })
})

//new page
app.get('/records/new', (req, res) => {
  res.render('new')
})

//post new table
app.post('/records', async (req, res) => {
  try {
    const body = req.body
    const categoryItem = await Category.findOne({ name: body.category })
    await Record.create({
      name: body.name,
      date: body.date,
      cost: body.cost,
      categoryId: categoryItem._id
    })
    res.redirect('/')
  }
  catch (error) {
    console.log(error)
  }
})

//edit page
app.get('/records/:_id/edit', (req, res) => {
  const id = req.params._id
  Record.findOne({ _id: id })
    .lean()
    .then(record => {
      return Category.findOne({ _id: record.categoryId })
        .then(category => {
          record.categoryName = category.name
          return record
        })
    })
    .then(record => {
      record.date = record.date.toISOString().slice(0, 10)
      res.render('edit', { record })
    })
})

//post edit table
app.put('/records/:_id', (req, res) => {
  const id = req.params._id
  const body = req.body
  return Category.findOne({ name: body.category })
    .then(categoryItem => {
      return Record.findOne({ _id: id })
        .then(record => {
          record.name = body.name
          record.date = body.date
          record.cost = body.cost
          record.categoryId = categoryItem._id
          return record.save()
        })
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//delete function
app.delete('/records/:_id', (req, res) => {
  const id = req.params._id
  return Record.findOne({ _id: id })
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.listen(port, () => {
  console.log(`App is listening on http://localhost:${port}`)
})