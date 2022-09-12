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
        var newInterest,interest_id;
        var lines = [];
        const result = await pool.query("SELECT interest_id FROM interests WHERE interest_name = $1",[interest_name]);
        console.log("result from selecting interest: ",result);
        //lines = result.rows;
        if(result.rows.length == 0){ // if interest doesn't exist
            console.log("if interest doesn't exist");
            newInterest = await pool.query("INSERT INTO INTERESTS (interest_name) VALUES($1) RETURNING * ",[interest_name]);
            interest_id = newInterest.rows[0].interest_id;
        }else{ // if interest exists
            console.log("if interest exists");
            interest_id = result.rows[0].interest_id;
        }
       // console.log("return from query insert into interests:  ",newInterest.rows[0].interest_id);
        //res.json(newInterest);
        console.log("interest_id:  ",interest_id);
       //const ID = await pool.query("SELECT user_id FROM USERS WHERE email $1",[email]);
        const newUserInterest = await pool.query("INSERT INTO USER_INTERESTS (interest_id,user_id) VALUES($1,$2) RETURNING * ",[interest_id,user_id]);
        console.log("return from query insert into user interests:  ",newUserInterest);
        res.json(newUserInterest);
    } catch(err){
        console.log(err.message);
    }
})
router.get("/:id",async(req,res)=>{//get all the users interests
    try{
        console.log("request: ",req.params);
        var user_id=req.params.id;
        console.log("user_id for interests",user_id);
        const result = await pool.query("SELECT interest_name FROM interests WHERE interest_id  in (SELECT interest_id from user_interests WHERE user_id = $1)",[user_id]);
        console.log("user results from db: ",result);
        resultArray=Object.values(result.rows);
        console.log("user interests from db: ",resultArray);
        var fuck;
        var Array=[];
        console.log("rows num: ",Object.values(result.rowCount));
        for(let i=0;i<result.rowCount;i++){
            fuck=resultArray[i];
            console.log(fuck.interest_name);
            Array.push(fuck.interest_name);
        }
        res.json(Array);
    } catch(err){
        console.log(err.message);
    }
})

router.get("/ordered/:id",async(req,res)=>{//get all the users interests
    try{
        console.log("request for ordered: ",req.params);
        var user_id=req.params.id;
        console.log("user_id for interests",user_id);
        const result = await pool.query("SELECT interest_name FROM interests WHERE interest_id  in (SELECT interest_id from user_interests WHERE user_id = $1  ORDER BY rating desc);",[user_id]);
        console.log("user results from db: ",result);
        resultArray=Object.values(result.rows);
        console.log("user interests from db: ",resultArray);
        var fuck;
        var Array=[];
        console.log("rows num: ",Object.values(result.rowCount));
        for(let i=0;i<result.rowCount;i++){
            fuck=resultArray[i];
            console.log(fuck.interest_name);
            Array.push(fuck.interest_name);
        }
        res.json(Array);
    } catch(err){
        console.log(err.message);
    }
})

router.get("/posts/:id",async(req,res)=>{//get all the users interests
    try{
        console.log("request: ",req.params);
        var user_id=req.params.id;
        console.log("user_id for interests posts",user_id);
        const result = await pool.query("SELECT interest_name FROM interests WHERE interest_id  in (SELECT interest_id from user_interests WHERE user_id = $1)",[user_id]);
        console.log("user results from db: ",result);
        resultArray=Object.values(result.rows);
        console.log("user interests from db: ",resultArray);
        var fuck;
        var Array=[];
        for(let i=0;i<result.rowCount;i++){
            fuck=resultArray[i];
            console.log(fuck.interest_name);
            Array.push("'"+fuck.interest_name+"'");
        }
        console.log("SELECT * FROM posts WHERE post_interest = any("+Array+") ");
        const posts = await pool.query("SELECT * FROM posts WHERE post_interest = any(ARRAY["+Array+"]) order by post_date desc;");
        console.log("posts with similar interests: ",posts);
        res.json(posts.rows);
    } catch(err){
        console.log(err.message);
    }
})

router.put("/rating/add",async(req,res)=>{
    try{
        console.log("request: ",req.body);
        var user_id=req.body[0];
        var interest_name=req.body[1];
        console.log("API => interest name: ",interest_name);
        console.log("API => user_id: ",user_id);
        const result = await pool.query("SELECT interest_id FROM interests WHERE interest_name = $1",[interest_name]);
       // console.log("return from query insert into interests:  ",newInterest.rows[0].interest_id);
        const interest_id = result.rows[0].interest_id;
        //res.json(newInterest);
        console.log("interest_id:  ",interest_id);
       //const ID = await pool.query("SELECT user_id FROM USERS WHERE email $1",[email]);
        const newUserInterest = await pool.query("UPDATE user_interests SET rating = rating + 1 WHERE user_id = $2 AND interest_id = $1 AND rating < 8",[interest_id,user_id]);
        console.log("return from query insert into user interests:  ",newUserInterest);
        res.json(newUserInterest);
    } catch(err){
        console.log(err.message);
    }
})

router.put("/rating/sub",async(req,res)=>{
    try{
        console.log("request: ",req.body);
        var user_id=req.body[0];
        var interest_name=req.body[1];
        console.log("API => interest name: ",interest_name);
        console.log("API => user_id: ",user_id);
        const result = await pool.query("SELECT interest_id FROM interests WHERE interest_name = $1",[interest_name]);
       // console.log("return from query insert into interests:  ",newInterest.rows[0].interest_id);
        const interest_id = result.rows[0].interest_id;
        //res.json(newInterest);
        console.log("interest_id:  ",interest_id);
       //const ID = await pool.query("SELECT user_id FROM USERS WHERE email $1",[email]);
        const newUserInterest = await pool.query("UPDATE user_interests SET rating = rating - 1 WHERE user_id = $2 AND interest_id = $1 AND rating > 0",[interest_id,user_id]);
        console.log("return from query insert into user interests:  ",newUserInterest);
        res.json(newUserInterest);
    } catch(err){
        console.log(err.message);
    }
});

// router.put("/rating/reduce",async(req,res)=>{
//     try{
//         console.log("request: ",req.body);
//         var [user_id,...args]=req.body;
//         var interest_name=req.body[1];
//         console.log("API => interest name: ",interest_name);
//         console.log("API => user_id: ",user_id);
//         const result = await pool.query("SELECT interest_id FROM interests WHERE interest_name = $1",[interest_name]);
//        // console.log("return from query insert into interests:  ",newInterest.rows[0].interest_id);
//         const interest_id = result.rows[0].interest_id;
//         //res.json(newInterest);
//         console.log("interest_id:  ",interest_id);
//        //const ID = await pool.query("SELECT user_id FROM USERS WHERE email $1",[email]);
//         const newUserInterest = await pool.query("UPDATE user_interests SET rating = rating - 1 WHERE user_id = $2 AND interest_id = $1 AND rating > 0",[interest_id,user_id]);
//         console.log("return from query insert into user interests:  ",newUserInterest);
//         res.json(newUserInterest);
//     } catch(err){
//         console.log(err.message);
//     }
// });

module.exports = router
