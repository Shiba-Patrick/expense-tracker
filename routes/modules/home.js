const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')
const User = require('../../models/user')

//藉由email來尋找user,category則透過name,其中_id來抓取record與兩資料庫的關聯

//home page
router.get('/', async (req, res) => {
  try {
    let totalAmount = 0
    const userId = req.user._id
    const items = await Record.find({ userId }).lean().sort({ date: 'desc' })
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
      // 如果是篩選全部
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
      // 如果是篩選個別選項
      const categoryItem = await Category.findOne({ name: search })
      const categoryId = categoryItem._id
      // 篩選出特定category的records
      const filteredRecords = allRecords.filter(record => {
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