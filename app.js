const express = require('express');
app = express();
const cors = require('cors');
//const dbService = require('./database');
//const pool = require("./db")
const usersRoutes = require('./routes/users')
// app.get('/',(req,res)=> {   moved to controllers
//     res.send('hello')
// })
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3000
app.listen(PORT, ()=> {
    console.log('Listening on Port: %d',PORT)
})
//app.use('/',require('./routes/hello.js'))
app.use('/users',usersRoutes);


app.use((req,res)=>{ //if no response
    res.status(404).render('404',{title: '404'}); 
    console.error('404');
});

