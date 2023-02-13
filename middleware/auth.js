const jwt = require('jsonwebtoken')
const User = require('../models/user')


const auth = (req, res, next)=>{
    let token = req.cookies.auth
    User.findByToken(token, (err, user)=>{
        if(err)throw err
        if(!user)return res.json({
            error: true
        })

        req.token= token
        req.user=user
        next()
    })
}
// const JWT_SECRET = 'signedbygrace'

// const auth = async(req, res, next) => {
//     try{
//     // const token = req.header('Authorization').replace('Bearer ','')
//     const token = req.cookies['auth_token']
//     const decodedToken = jwt.verify(token,JWT_SECRET)
//     const user = await User.findOne({_id: decodedToken._id , "tokens.token": token})

//     if(!user){
//         throw new Error('unauthorized user!')
//     }
//     console.log(user)
//         req.token = token
//         req.user = user

//     next()//passing control to next function in the chain
//     }
//     catch(e){
//         res.status(500).send()
//         console.log(e)
//     }
// }

module.exports = auth