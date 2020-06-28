const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true
})

// const User = mongoose.model('User', {
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     }, 
//     email: {
//         type: String,
//         required: true,
//         trim:true,
//         lowercase: true,
//         validate(value) {
//             if(!validator.isEmail(value)){
//                 throw new Error('Email is invalid')
//             }
//         }
//     },
//     password: {
//         type: String,
//         required: true,
//         trim:true,
//         minlength: 7,
//         validate(value){
//             if(value.includes('password'))
//             {
//                 throw new Error('Password cannot contain the string password')
//             }
//         }
//     },
//     age: {
//         type: Number,
//         default: 0,
//         validate(value) {
//             if(value<0){
//                 throw new Error('Age must a positive number')
//             }
//         }
//     }
// })

const Task = mongoose.model('Tasks', {
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})

const newTask = new Task({
    description: 'Complete Nodejs course'
})

newTask.save().then(() => {
        console.log(newTask)
    }).catch((error) => {
        console.log('Error!', error)
    })

const me = new User({name: 'Shivangi',email: 'checkformat@gmail.com', password:'pass@123'})

me.save().then(() => {
    console.log(me)
}).catch((error) => {
    console.log('Error!', error)
})