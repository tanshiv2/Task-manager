const express = require('express')
const path = require('path')
const hbs = require('hbs')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT

app.use(express.json())

//Define paths for express config
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use(express.static(path.join(__dirname,'../public')))

app.use(userRouter)
app.use(taskRouter)

app.get('*', (req,res) => {
    res.render('404', { 
        error: 'Page not found'
    })
})


app.listen(port,() => {
    console.log('Server is up on port' + port)
})

const Task = require('./models/tasks')
const User = require('./models/users')

