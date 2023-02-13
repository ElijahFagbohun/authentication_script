const express = require('express')
const ToDo = require('../models/todo')
const auth = require('../middleware/auth')

const router =  express.Router()

router.post('/todo/new',auth, (req, res) => {
      const todo = new ToDo({...req.body, owner: req.user._id})

    todo.save().then((todo) => {
        res.status(200).send(todo)
    }).catch((e) => {
        res.status(500).send({fail: "something went wrong somewhere"})
        console.log(e)
    })
})

router.get('/todo/:id', auth, (req, res) => {
    const _id = req.params.id

    ToDo.findById(_id).then((todo) => {
        if(!todo){
            res.status(404).send("Task does not exist or has been deleted")
        }
        else{
            res.status(200).send(todo)
        }
    }).catch((e) => {
        res.status(500).send("Failed to fetch todo")
        console.log(e)
    })
})

router.delete('/todo/:id',auth, (req, res) => {
    const _id = req.params.id

    ToDo.findByIdAndDelete(_id).then(() => {
        res.status(200).send({delete: "todo deleted successfully"})
    }).catch((e) => {
        res.status(500).send("Could not delete todo")
        console.log(e)
    })
})

router.get('/alltodos', (req, res) => {
    ToDo.find({}).then((todos) => {
        if(!todos){
            res.status(404).send("Todos do not exist")
        }
        else{
            res.status(200).send(todos)
        }
    }).catch((e) => {
        res.status(500).send("Could not fetch todos")
    })
})

router.patch('/todo/:id',auth, (req, res) => {
    const _id = req.params.id

    ToDo.findByIdAndUpdate(_id, req.body, {new: true}).then(() => {
        res.status(200).send({update: "successful update on todo"})
    }).catch((e) => {
        res.status(500).send("Could not update todo")
        console.log(e)
    })
})

module.exports = router