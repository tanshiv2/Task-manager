const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(port,() => {
    console.log('Server is up on port' + port)
})

const Task = require('./models/tasks')
const User = require('./models/users')

const main = async () => {
    // const task = await Task.findById('')
    // await task.populate('owner').execPopulate()
    // console.log()

    // const user = await User.findById('5efc2c680a80646f0df7c1f4')
    // await user.populate('tasks').execPopulate()
    // console.log(user.tasks)
}

main()