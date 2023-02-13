const mongoose = require('mongoose')

const toDoSchema = new mongoose.Schema({
    description: {
        type: String, 
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

toDoSchema.methods.toJSON = function(){
    const todo = this
    const todoObject = todo.toObject()

    delete todoObject._id
    delete todoObject.owner
    delete todoObject.createdAt
    delete todoObject.updatedAt
    delete todoObject.__v

    return todoObject
}
const ToDo = mongoose.model('ToDo', toDoSchema)
module.exports = ToDo