// const mongo = require('mongodb')
// const mongoClient = mongo.MongoClient

// const connectionURL = 'mongodb://127.0.0.1:27017'
// const databaseName = 'login'

// mongoClient.connect( connectionURL,{ useNewURLParser: true, useUnifiedTopology: true}, (error, client) => {
//         if(error){
//             console.log(`Error connecting to `)
//         }
//         else{
//             console.log(`Successfully connected to database`)
//         }
    
//     const db = client.db(databaseName)

//     // Queries: are operations that are run on databases e.g fetch, insert
//     db.collection('users').insertMany([
//         {firstName: "Osazie", LastName: "Ogbayamo", age: 14},
//         {firstName: "Emmanuel", LastName: "yamo", age: 14},
//         {firstName: "Grace", LastName: "Ayo", age: 44}
//     ],
//      (error, insert) => {
//         if(error){
//             console.log("Insertion failed")
//         }
//         else{
//             console.log("Successfully saved field")
//         }
//     })

//     db.collection('users').find((e, f) => {
//         if(e){
//             console.log("failed")
//         }
//         else{
//             console.log(f)
//         }
//     })
    
// })