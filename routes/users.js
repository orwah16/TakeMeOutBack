const express = require('express'),
router = express.Router(),
hello = require('../controllers/hello.js')
const pool = require("../db")

//router.get('/',hello.hello)//when somone calls the / route it calls the hello function from the controller
router.post("/",async(req,res)=>{
    try{
        const {id,firstname,lastname} = req.body;
        const newUser = await pool.query("INSERT INTO USERS (id,firstname,lastname) VALUES($1,$2,$3) RETURNING * ",[id,firstname,lastname]);
        res.json(newUser);
        console.log(req.body);
    } catch(err){
        console.log(err.message);
    }
})

router.get("/",async(req,res)=>{
    try{
        console.log("------------- getting users -------------");
        const allUsers = await pool.query("SELECT * FROM users");
        res.send("WTF");
        res.json(allUsers.rows);
        console.log("------------- getting users -------------");
    }catch(err){
        console.error(err.message);
    }
})

router.get("/:id",async (req,res)=>{
    try{
        const {id} = req.params;
        const users = await pool.query("SELECT * FROM users WHERE id = $1",[id]);
        res.json(users.rows);

    } catch(err){
        console.log(err.message);
    }
})

router.put("/:id",async (req,res)=>{
    try {
        const {id} = req.params;
        const {firstname,lastname} = req.body;
        const updateUser = await pool.query("UPDATE users SET firstname = $1 AND lastname = $2 WHERE id = $3",[firstname,lastname,id]);
        res.json("user updated");
    } catch (err) {
        console.error(err.message);
    }
});
module.exports = router