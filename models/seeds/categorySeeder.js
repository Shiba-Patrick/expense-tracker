const db = require('../../config/mongoose')
const mongoose = require('mongoose')
const Category = require('../category')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const categoryList = [
  {
    name: '家居物業',
    icon: '<i class="fa-solid fa-house fa-xl"></i>'
  },
  {
    name: '交通出行',
    icon: '<i class="fa-solid fa-van-shuttle fa-xl"></i>'
  },
  {
    name: '休閒娛樂',
    icon: '<i class="fa-solid fa-face-grin-beam fa-xl"></i>'
  },
  {
    name: '餐飲食品',
    icon: '<i class="fa-solid fa-utensils fa-xl"></i>'
  },
  {
    name: '其他',
    icon: '<i class="fa-solid fa-pen fa-xl"></i>'
  }
]

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

db.on('error', () => {
  console.log('mongoDB error!!!!!!!')
})
db.once('open', () => {
  Category.insertMany(categoryList)
  .then(()=> console.log('categorySeeder created!!!'))
  .catch(error => console.log(error))
})
