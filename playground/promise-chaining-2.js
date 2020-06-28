require('../src/db/mongoose')
const Task = require('../src/models/tasks')
const { countDocuments } = require('../src/models/tasks')


Task.findByIdAndDelete('5ef850d1453e611323f9feae').then((task) => {
    console.log(task)
    return Task.countDocuments({completed: false})
}).then((result) => {
    console.log(result)
}).catch((e) => {
    console.log(e)
})