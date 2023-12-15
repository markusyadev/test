import express from "express";
import {appendFileSync} from 'fs';
const app = express()

app.use(express.static('./'))
app.use(express.json());

app.listen(3000, () => {
    console.log('Succes')
})

app.post('/registration',(req,res) => {
    console.log(req.body)
    appendFileSync('info.txt',JSON.stringify(req.body) + '\n')
    
})
