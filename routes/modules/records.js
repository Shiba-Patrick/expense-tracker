const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')
const User = require('../../models/user')

//new page
router.get('/new', (req, res) => {
  res.render('new')
})

//post new table:add userId
router.post('/', async (req, res) => {
  try {
    const userId = req.user._id //使用者索引_id
    const body = req.body //輸出value
    const categoryItem = await Category.findOne({ name: body.category }) //用name搜尋category,然後create資料
    await Record.create({
      name: body.name,
      date: body.date,
      cost: body.cost,
      categoryId: categoryItem._id, userId
    })
    res.redirect('/')
  }
  catch (error) {
    console.log(error)
  }
})

//edit page:add userId
router.get('/:_id/edit', async (req, res) => {
  try {
    const _id = req.params._id //特定使用者資料導入頁面_id
    const userId = req.user._id
    const record = await Record.findOne({ _id, userId }).lean() //運用lean()轉換查詢效果
    const category = await Category.findOne({ _id: record.categoryId })
    record.categoryName = category.name
    record.date = record.date.toISOString().slice(0, 10)
    res.render('edit', { record })
  }
  catch (error) {
    console.log(error)
  }
})

//post edit table:add userId:如同修改新增 將record跟category配合user_id
router.put('/:_id', async (req, res) => {
  try {
    const _id = req.params._id
    const userId = req.user._id
    const body = req.body
    const record = await Record.findOne({ _id, userId })
    const categoryItem = await Category.findOne({ name: body.category })

    record.name = body.name
    record.date = body.date
    record.cost = body.cost
    record.categoryId = categoryItem._id
    record.save()
    req.flash('success_msg', '修改完成')
    res.redirect(`/records/${_id}/edit`)
  }
  catch (error) {
    console.log(error)
  }
})

//delete function:add userId
router.delete('/:_id', async (req, res) => {
  try {
    const _id = req.params._id
    const userId = req.user._id
    const record = await Record.findOne({ _id, userId })
    record.remove()
    res.redirect('/')
  }
  catch (error) {
    console.log(error)
  }
})

module.exports = router
