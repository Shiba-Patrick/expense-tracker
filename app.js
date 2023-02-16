const express = require('express')
const express_hbs = require('express-handlebars')
const bodyParser = require('body-parser')

const app = express()
const port = 3000

//handlebars模板引勤
app.engine('handlebars', express_hbs({defaultLayout:'main'}))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true })) //連結post傳入

//home page
app.get('/', (req, res)=>{
  res.render('index')
})

//new page
app.get('/new', (req, res)=>{
  res.render('new')
})

//post new table
app.post('/new',(req, res)=>{
  const body = req.body
  console.log(body) //test
  res.render('new', {body})
})

//edit page
app.get('/edit', (req, res)=>{
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