const express = require('express')
const express_hbs = require('express-handlebars')

const app = express()
const port = 3000

//handlebars模板引勤
app.engine('handlebars', express_hbs({defaultLayout:'main'}))
app.set('view engine', 'handlebars')

app.get('/', (req, res)=>{
  res.render('index')
})

app.listen(port, () => {
  console.log(`App is listening on http://localhost:${port}`)
})