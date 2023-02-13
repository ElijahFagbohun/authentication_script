const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const salt = 10
const jwt = require('jsonwebtoken')
const config = require('../config/config').get(process.env.NODE_ENV)

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Enter a valid email address") 
            }
        }
    },
    age: {
        type: Number,
        trim: true,
        default: 0
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
        // length: { min: 11, max: 11},
        validate(value){
            if(value.length === 0){
                throw new Error('Please enter a valid Nigerian phone number')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        length: { min: 8 },
        validate(value){
            if(value.length === 0){
                throw new Error("Enter a password to proceed")
            }
        }
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    tokens: [{
        token: String
    }]
}, {
    timestamps: true,

    
    
})

userSchema.virtual('todos', {
    ref: 'ToDo',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.pre('save', function(next){
    const user = this

    if(user.isModified('password')){
        bcrypt.genSalt(salt, function(err, salt){
            if(err) return next(err)

            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err)
                user.password=hash
                next()
            })
        })
    }
    else{
        next()
    }

    // if(user.password){
    //     user.password = await bcrypt.hash(user.password, 8)
    //     console.log(user.password)
    // }
    // next()
})

userSchema.methods.generateAuthToken = function(cb) {
    const user = this
    const token = jwt.sign(user._id.toHexString(), config.SECRET)

    user.token = token
     user.save(function(err, user){
        if(err)return cb(err)
        cb(null, user)
    })
    return token
}
userSchema.statics.findByToken = function(token, cb){
    const user = this

    jwt.verify(token, config.SECRET, function(err, decode){
        user.findOne({"_id": decode, "token":token}, function(err, user){
            if(err) return cb(err)
            cb(null, user)
        })
    })
}

userSchema.methods.comparepassword= function(password, cb){
       bcrypt.compare(password, this.password, function(err, isMatch){
        if(err)return cb(next)
        cb(null, isMatch)
    })
}
userSchema.methods.deleteToken = function(token, cb){
    const user = this

    user.update({$unset: {token:1}}, function(err, user){
        if(err)return cb(err)
        cb(null, user)
    })
}
// const user = await User.findOne({ email })

// if(!user){
//     throw new Error("Unable to login, enter valid email")
// }
// const isPasswordCorrect = await bcrypt.compare(password, user.password)

// if(!isPasswordCorrect){
//     throw new Error("Unable to login, enter vaiid password")
// }
//     return user
// }

const User = mongoose.model('User', userSchema)
module.exports = User