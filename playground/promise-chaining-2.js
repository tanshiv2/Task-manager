require('../src/db/mongoose')
const Task = require('../src/models/tasks')
const { countDocuments, findByIdAndDelete } = require('../src/models/tasks')


Task.findByIdAndDelete('5ef850d1453e611323f9feae').then((task) => {
    console.log(task)
    return Task.countDocuments({completed: false})
}).then((result) => {
    console.log(result)
}).catch((e) => {
    console.log(e)
})

const deleteTaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({completed: false})
    return count
}

deleteTaskAndCount('5ef85d99a0293e14a1c863c3').then((result) => {
    console.log('count' + result)
}).catch((e) => {
    console.log(e)
})