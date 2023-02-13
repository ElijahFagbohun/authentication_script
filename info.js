const express = require('express')
const chalk =  require('chalk')

const app = express()

let PORT = 5050;

let Data =  " ";
const Directory = {
	Name: 'Name: <b>info</b>',
	Developer: 'Developer: <b>Elijah</b>',
	Description: 'Description: <b>The most fascinating app</b>',
	Dependencies:`Dependecies: <b>${['Chalk', ' express']}</b>`,
	version: `Version: <b>${1.0}</b>`,
	Endpoint:'Enpoint: <b>info</b>',
	port: `Port: <b>${PORT}</b>`
}

for(let x in Directory){
	Data += Directory[x] + '<br>';
}

app.get('/info', (request, response)=>{
	response.send(`<h3> This is your Data:</h3> ${Data}`)
})

app.listen(PORT, ()=>{
	console.log(`You are currenly running on Port: ${PORT}`)
})