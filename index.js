const express = require('express')
const path = require('path')
const userRouter = require('./router/user')
const toDoRouter = require('./router/todo')
const auth = require('./middleware/auth')
const cookieParser = require('cookie-parser')
const bodyparser = require('body-parser')
// const mongoose  = require('mongoose')
require('./db/mongoose')
// const db = require('./config/config').get(process.env.NODE_ENV)

//Create an express application
const app = express()
const PORT = 8000 || process.env.PORT

const pathToViews = path.join(__dirname, 'src/views')
const pathToStyle = path.join(__dirname, 'public/css')
const pathToImg = path.join(__dirname, 'public/img')
const pathToJS = path.join(__dirname, 'public/js')

app.set('views', pathToViews)
app.use(express.static(pathToViews))
app.use(express.static(pathToStyle))
app.use(express.static(pathToImg))
app.use(express.static(pathToJS))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(bodyparser.urlencoded({extended: false}))
app.use(cookieParser())
app.use(bodyparser.json())

app.use(userRouter)
app.use(toDoRouter)

//Database connection
// mongoose.Promise = global.Promise
// mongoose.connect(db.DATABASE, {useNewUrlParser: true, useUnifiedTopology:true}, function(err){
//     if(err)console.log(err)
//     console.log("database is connected")
// })
// Creating an endpoint to test express
app.get('/', (request, response) => {
    response.sendFile(pathToViews + '/home.html')
})

app.get('/register', (request, response) => {
    response.sendFile(pathToViews + '/register.html')
})

app.get('/login', (req, res) => {
    res.sendFile(pathToViews + '/login.html')
})

app.get('/todos', (req, res) => {
    res.sendFile(pathToViews + '/todo.html')
})

app.post('/login', (req, res) => {
    res.send({info: 'post response from login'})
})

app.get('/info', (request, response) => response.send("<h1>Basic CRUD web app</h1>"))

app.listen(PORT, () => console.log(`Your server is running on port ${PORT}`))