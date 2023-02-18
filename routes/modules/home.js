const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')
const User = require('../../models/user')

//home page
router.get('/', async (req, res) => {
  try {
    let totalAmount = 0
    const userId = req.user._id
    const items = await Record.find({ userId }).lean().sort({ date: 'desc' }) //資料排序遞減
    const records = await Promise.all(items.map(async (item) => {
      const category = await Category.findOne({ _id: item.categoryId })
      item.categoryIcon = category.icon
      item.date = item.date.toISOString().slice(0, 10)
      totalAmount += item.cost
      return item
    }))
    records.totalAmount = totalAmount
    res.render('index', { records })
  }

  catch (error) {
    console.log(error)
  }
})

//search-bar function
router.post('/search', async (req, res) => {
  try {
    let totalAmount = 0
    const userId = req.user._id
    const allRecords = await Record.find({ userId }).lean().sort({ date: 'desc' })
    const search = req.body.search

    if (search === '全部') {
      // search all
      const records = await Promise.all(allRecords.map(async (record) => {
        const category = await Category.findOne({ _id: record.categoryId })
        record.categoryIcon = category.icon
        record.date = record.date.toISOString().slice(0, 10)
        totalAmount += record.cost
        return record
      }))
      records.totalAmount = totalAmount
      res.render('index', { records })
    } else {
      // search one
      const categoryItem = await Category.findOne({ name: search })
      const categoryId = categoryItem._id
      const filteredRecords = allRecords.filter(record => { //filter篩選
        return (JSON.stringify(record.categoryId)) === (JSON.stringify(categoryId))
      })
      const records = filteredRecords.map(record => {
        record.categoryIcon = categoryItem.icon
        record.date = record.date.toISOString().slice(0, 10)
        totalAmount += record.cost
        return record
      })
      records.totalAmount = totalAmount
      records.categoryName = categoryItem.name
      res.render('index', { records })
    }
  }
  catch (error) {
    console.log(error)
  }
})

module.exports = router