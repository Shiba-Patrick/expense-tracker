const mongoose = require('mongoose')
const Category = require('../category')

const categoryList = [
  {
    name: '家居物業',
    icon: '<i class="fa-solid fa-house"></i>'
  },
  {
    name: '交通出行',
    icon: '<i class="fa-solid fa-van-shuttle"></i>'
  },
  {
    name: '休閒娛樂',
    icon: '<i class="fa-solid fa-face-grin-beam"></i>'
  },
  {
    name: '餐飲食品',
    icon: '<i class="fa-solid fa-utensils"></i>'
  },
  {
    name: '其他',
    icon: '<i class="fa-solid fa-pen"></i>'
  }
]

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('mongoDB error!!!!!!!')
})
db.once('open', () => {
  console.log('mongoDB connected!!!')
  Category.insertMany(categoryList)
  .then(()=> console.log('categorySeeder created!!!'))
  .catch(error => console.log(error))
})
