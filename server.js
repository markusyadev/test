import express from "express";
import {appendFileSync} from 'fs';
const app = express()

app.use(express.static('./'))
app.use(express.json());

app.listen(3000, () => {
    console.log('Succes')
})

app.post('/stats',(req,res) => {
    console.log(req.body)
    appendFileSync('stats.txt',JSON.stringify(req.body) + '\n')
    
})
