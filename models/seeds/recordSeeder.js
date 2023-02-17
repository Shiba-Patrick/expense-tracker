const db = require('../../config/mongoose')
const bcrypt = require('bcryptjs')
const Category = require('../category')
const Record = require('../record')
const User = require('../user')
const RecordList = require('./records.json').results

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
//user seeder
const SeedUser = [
  {
    name: 'user1',
    email: 'user1@example.com',
    password: '12345678',
    recordIndexes: [1, 3, 4],
  }, {
    name: 'user1',
    email: 'user2@example.com',
    password: '12345678',
    recordIndexes: [0, 2, 3, 4],
  }
]

//create seed
db.once('open', async () => {
  try {
    await Promise.all(SeedUser.map(async (user) => {
      const { name, email, password } = user
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)
      const seederUser = await User.create({
        name,
        email,
        password: hash,
      })
      const userId = seederUser._id
      await Promise.all(user.recordIndexes.map(async (index) => {
        const record = RecordList[index]
        const categoryItem = await Category.findOne({ name: record.category })
        const categoryId = categoryItem._id
        await Record.create({
          name: record.name,
          date: record.date,
          cost: record.cost,
          categoryId,
          userId
        })
      }))
    }))
    console.log('user&recordSeeder created!!!')
    process.exit()
  }
  catch(error){
    console.log(error)
  }
})