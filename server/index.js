const express = require('express')
const app = express()
const mysql = require('mysql2')
const cors = require('cors')

app.use(cors())
app.use(express.json())


const db = mysql.createConnection({
    
})

app.get('/',(req,res)=>{
    db.query("SELECT * FROM snippets",(err,result)=>{
        if(err){
            console.log('there is an error in node JS' +err)
        }
        else{
            res.send(result)
            
        }
    })
})

app.listen()

