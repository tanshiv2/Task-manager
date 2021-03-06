const mongoose = require('mongoose')
const validator = require('validator')

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }, 
    due: {
        type: Date
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    }
}, {
    timestamps: true
})

// taskSchema.pre('save', async function (next) {
//     next()
// })

const Task = mongoose.model('Tasks', taskSchema)

module.exports = Task