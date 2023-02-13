const express = require('express')
const User = require('../models/user')

const router =  express.Router()

router.post('/signup', async (req, res) => {
    const userDetails = new User(req.body)

    try{
        await userDetails.save()
        res.status(201).send({user: "saved successfully"})
    }
    catch(e){
        res.status(500).send({fail: "user not saved"})
        console.log(e)
    }
})

router.get('/user/:id', async (req, res) => {
    const _id = req.params.id

    try{
        const user = await User.findById(_id)
        res.status(200).send({ user })
        console.log(user)
    }
    catch(e){
        res.status(500).send({fail: "could not fetch user"})
        console.log(e)
    }
})

router.post('/user/login', async (req, res) => {
    try{
        const user = await User.loginUserUsingEmailAndPassword(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({ user, token })
    }
    catch(e){
        res.status(401).send("Failed to log user in")
        console.log(e)
    }
})

router.delete('/user/:id', async (req, res)=> {
    const _id = req.params.id
    
    try{
        const user = await User.findByIdAndDelete(_id)
        if(!user){
            res.status(404).send({error: "User does not exist or has been deleted"})
        }
        else{
            res.status(200).send({delete: "user deleted successfully"})
        }
    }
    catch(e){
        res.status(500).send({fail: "cannot delete user due to bad request"})
    }
})

router.get('/users', async (req, res) => {
    try{
        const users = await User.find({})
            if(users.length === 0){
                res.status(404).send("No Users found")
            }
            else{
                res.status(200).send({users})
            }
    }
    catch(e){
        res.status(500).send({error: "cannot fetch all users due to a bad request"})
    }
})

router.post('/user/logout', async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            token.token !== req.token // || req.user.token
         })
         await req.user.save()
         res.status(200).send(`${req.user.email} just logged out`)
    }catch(e){
        res.status(500).send('logout failed')
    }
})

router.post('/user/logoutallsessions', async (req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.status(200).send(`${req.user.email} just logged out of all sessions`)
    }catch(e){
        res.status(500).send('could not log out all sessions')
    }
})

router.patch('/user/:id', async (req, res) => {
    const _id = req.params.id

    const updates = Object.keys(req.body)
    const validUpdates = ['firstName', 'lastName', 'email', 'password', 'address']
    const isValidUpdate = updates.every((update) => validUpdates.includes(update))

    if(!isValidUpdate){
       return res.status(400).send({error: "You are not allowed to update the selected fields"})
    }

    try{
        const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true})
        if(user){
            res.status(200).send({user})
        }
        else{
            res.status(400).send("fail to update")
        }
    }
    catch(e){
        res.status(500).send({fail: "Something is wrong somewhere"})
        console.log(e)
    }
})

module.exports = router