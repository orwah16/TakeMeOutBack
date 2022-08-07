const express = require('express'),
router = express.Router(),
hello = require('../controllers/hello.js');
const pool = require("../db");

//router.get('/',hello.hello)//when somone calls the / route it calls the hello function from the controller
router.post("/",async(req,res)=>{
    try{
        console.log(req.body);
        const [first_name,last_name,email] = req.body;
        console.log(first_name);
        const newUser = await pool.query("INSERT INTO USERS (first_name,last_name,email) VALUES($1,$2,$3) RETURNING * ",[first_name,last_name,email]);
        res.json(newUser);
        console.log(req.body);
    } catch(err){
        console.log(err.message);
    }
})

router.get("/",async(req,res)=>{
    try{
        const allUsers = await pool.query("SELECT * FROM users");
        res.json(allUsers.rows);
        console.error("got users");
    }catch(err){
        console.error(err.message);
    }
})

router.get("/:email",async (req,res)=>{
    try{
        console.log("id by email params: ",req.params);

        const email = req.params;
        console.log("email param: ",email.email);

        const users = await pool.query("SELECT user_id FROM users WHERE email = $1",[email.email]);
        console.log("user from users/:email: ",users);
        //console.log("user from users/:email: ",res);

        userID=users.rows[0].user_id;
        console.log("userID from /:email: ",userID);
        res.json(userID)
    } catch(err){
        console.log(err.message);
    }
})

router.get("/:id",async (req,res)=>{
    try{
        const {id} = req.params;
        const users = await pool.query("SELECT * FROM users WHERE user_id = $1",[id]);
        res.json(users.rows[0]  );

    } catch(err){
        console.log(err.message);
    }
})

router.put("/:id",async (req,res)=>{
    try {
        const {user_id} = req.params;
        const {first_name,last_name} = req.body;
        const updateUser = await pool.query("UPDATE users SET first_name = $1, last_name = $2 WHERE user_id = $3",[first_name,last_name,user_id]);
        res.json("user updated");
    } catch (err) {
        console.error(err.message);
    }
})

router.delete("/:id",async (req,res)=>{
    try {
        const {user_id} = req.params;
        const updateUser = await pool.query("DELETE FROM users WHERE user_id = $1",[user_id]);
        res.json("user deleted");
    } catch (err) {
        console.error(err.message);
    }
});
module.exports = router