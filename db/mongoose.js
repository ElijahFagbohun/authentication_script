const mongoose = require('mongoose')

const connectionURL = "mongodb://127.0.0.1:27017/login"

mongoose.connect(connectionURL, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true
}, (error, connect) => {
    if(error){
        console.log("Oops, could not connect to DB")
    }
    else{
        console.log("Welcome, Successfully connected to database")
    }
})