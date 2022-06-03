const express = require('express'),
router = express.Router(),
hello = require('../controllers/hello.js');
const pool = require("../db");

//router.get('/',hello.hello)//when somone calls the / route it calls the hello function from the controller
router.post("/",async(req,res)=>{
    try{
        //console.log(req.body);
        const {first_name,last_name} = req.body;
        const newUser = await pool.query("INSERT INTO USERS (first_name,last_name) VALUES($1,$2) RETURNING * ",[first_name,last_name]);
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
        res.json(allUsers.rows);
        console.log("------------- getting users -------------");
    }catch(err){
        console.error(err.message);
    }
})

router.get("/:id",async (req,res)=>{
    try{
        const {id} = req.params;
        const users = await pool.query("SELECT * FROM users WHERE user_id = $1",[id]);
        res.json(users.rows);

    } catch(err){
        console.log(err.message);
    }
})

router.put("/:id",async (req,res)=>{
    try {
        const {user_id} = req.params;
        const {first_name,last_name} = req.body;
        const updateUser = await pool.query("UPDATE users SET first_name = $1 AND last_name = $2 WHERE user_id = $3",[first_name,last_name,user_id]);
        res.json("user updated");
    } catch (err) {
        console.error(err.message);
    }
});
module.exports = router