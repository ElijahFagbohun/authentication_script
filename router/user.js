const express = require('express')
require('bcrypt')
const User = require('../models/user')
const auth = require('../middleware/auth')
const { userWelcomeMail, userGoodbyeMail } = require('../email/email')

const router =  express.Router()


router.post('/signup', function (req, res) {
    const newuser = new User(req.body)
         User.findOne({email:newuser.email}, function(err, user){
             if(user)return res.status(400).json({auth: false, message:"email exists"})

             newuser.save((err, doc)=>{
                 if(err)return res.status(400).json({success:false})
                //  res.status(200).json({success:true, user:doc})
                res.redirect('/login')
             })
         })
    
})
//     try{
//         await userDetails.save()
//         userWelcomeMail(userDetails.email, userDetails.firstName)
//         // res.status(201).send({user: "saved successfully"})
//         res.redirect('/login')
//     }
//     catch(e){
//         res.status(500).send({fail: "user not saved"})
//         console.log(e)
//     }
// })

router.get('/user/:id',auth, async(req, res) => {
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

router.post('/user/login', function(req, res){
    const token = req.cookies.auth
    User.findByToken(token, (err, user)=>{
        if(err)return res(err)
        if(user)return res.status(400).json({
            error:true,
            message:"you are already logged in"
        })

        else{
            User.findOne({'email':req.body.email}, function(err, user){
                if(!user)return res.json({isAuth: false, message:'Auth failed, email not found'})

               user.comparepassword(req.body.password, (err, isMatch)=>{
                  if(!isMatch)return res.json({isAuth :false, message:"password doesn't match"}) 

                  user.generateAuthToken((err, user)=>{
                      if(err)return res.status(400).send(err)
                      res.cookie('auth', user.token).json({
                          isAuth:true,
                          id:user._id,
                          email: user.email
                      })
                  })
               })
            })
        }
    })


})
//     try{
//         const user = await User.loginUserUsingEmailAndPassword(req.body.email, req.body.password)
//         const token = await user.generateAuthToken()
//         res.cookie('auth_token', token)
//         // res.status(200).send({ user, token })
//         res.redirect('/index.html')
// }
//     catch(e){
//         res.status(401).send("Failed to log user in")
//         console.log(e)
//     }
// })

//get logged in user
 router.get('/user/profile', auth, function(err,res){
   res.json({
      isAuth: true,
      id: req.user._id,
      email:req.user.email,
      name: req.user.firstName + req.user.lastName
   })
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

router.post('/user/logout',auth, function(req, res){
      req.user.deleteToken(req.token, (err, user)=>{
          if(err)return res.status(400).send(err)
          res.sendStatus(200)
      })
}) 
//     try{
//         req.user.tokens = req.user.tokens.filter((token) => {
//             return token.token !== req.token
//         })
//          await req.user.save()
//          res.status(200).send(`${req.user.email} just logged out`)
//     }catch(e){
//         res.status(500).send('logout failed')
//     }
// })

router.post('/user/logoutallsessions',auth, async (req, res) => {
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