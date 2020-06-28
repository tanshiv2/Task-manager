require('../src/db/mongoose')

const User = require('../src/models/users')


// User.findByIdAndUpdate('5ef8606ed73f961584cfdba6', {age:1}).then((user) =>{
//     console.log(user)
//     return User.countDocuments({age:1})
// }).then((result) => {
//     console.log(result)
// }).catch((e)=> {
//     console.log(e)
// })
   
const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, {age})
    const count = await User.countDocuments({age})
    return count
}

updateAgeAndCount('5ef8606ed73f961584cfdba6', 2).then((result) => {
    console.log('Count :' + count)
}).catch((e) => {
    console.log(e)
})