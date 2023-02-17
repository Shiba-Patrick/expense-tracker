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
    const email = req.user.email
    const user = await User.findOne({ email})
    const userId = user._id

    const body = req.body
    const categoryItem = await Category.findOne({ name: body.category })
    await Record.create({
      name: body.name,
      date: body.date,
      cost: body.cost,
      categoryId: categoryItem._id,userId
    })
    res.redirect('/')
  }
  catch (error) {
    console.log(error)
  }
})

//edit page:add userId
router.get('/:_id/edit', async(req,res)=>{
  try{
    const _id = req.params._id
    const email = req.user.email
    const user = await User.findOne({ email })
    const userId = user._id
    const record = await Record.findOne({ _id, userId}).lean()
    const category = await Category.findOne({ _id: record.categoryId})
    record.categoryName = category.name
    record.date = record.date.toISOString().slice(0, 10)
    res.render('edit', { record })
  }
  catch (error) {
    console.log(error)
  }
})

//post edit table:add userId
router.put('/:_id', async (req, res) => {
  try{
    const _id = req.params._id
    const email = req.user.email
    const user = await User.findOne({ email })
    const userId = user._id
    const body = req.body
    const record = await Record.findOne({ _id, userId })
    const categoryItem = await Category.findOne({ name: body.category })
    
    record.name = body.name
    record.date = body.date
    record.cost = body.cost
    record.categoryId = categoryItem._id
    record.save()
    res.redirect('/')
  }
    catch(error){
      console.log(error)
    }
})

//delete function:add userId
router.delete('/:_id', async(req, res) => {
  try{
    const _id = req.params._id
    const email = req.user.email
    const user = await User.findOne({ email })
    const userId = user._id
    const record = await Record.findOne({ _id, userId })
    record.remove()
    res.redirect('/')
  }
    catch(error){
      console.log(error)
    } 
})

module.exports = router
