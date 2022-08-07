const express = require('express'),
router = express.Router(),
hello = require('../controllers/hello.js');
const pool = require("../db");


router.post("/",async(req,res)=>{
    try{
        console.log("request: ",req.body);
        var user_id=req.body[1];
        var interest_name=req.body[0];
        console.log("API => interest name: ",interest_name);
        console.log("API => user_id: ",user_id);
        const newInterest = await pool.query("INSERT INTO INTERESTS (interest_name) VALUES($1) RETURNING * ",[interest_name]);
       // console.log("return from query insert into interests:  ",newInterest.rows[0].interest_id);
        const interest_id = newInterest.rows[0].interest_id;
        res.json(newInterest);
        console.log("interest_id:  ",interest_id);
       //const ID = await pool.query("SELECT user_id FROM USERS WHERE email $1",[email]);
        const newUserInterest = await pool.query("INSERT INTO USER_INTERESTS (interest_id,user_id) VALUES($1,$2) RETURNING * ",[interest_id,user_id]);
        console.log("return from query insert into user interests:  ",newInterest);
        res.json(newUserInterest);
    } catch(err){
        console.log(err.message);
    }
})
router.get("/",async(req,res)=>{
})
module.exports = router