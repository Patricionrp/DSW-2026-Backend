import express from 'express'

const app = express()
app.use(express.json())

app.get('/', function (req, res) {
    
    res.send('TP-Backend');
});



app.listen(3000, () => {
  console.log('Server runnning on http://localhost:3000/')
})
