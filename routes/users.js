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
})
router.get("/friends/:id",async (req,res)=>{
    try{
        const user_id = req.params;
        console.log("user id in get friends: ",user_id.id);
        const friends = await pool.query("SELECT * FROM users WHERE user_id  in (SELECT user2 from friends WHERE user1 = $1)",[user_id.id]);
        console.log("friends: ",Object.values(friends.rows));
        res.json(Object.values(friends.rows));

    } catch(err){
        console.log("friends error: ",err.message);
    }
})

router.post("/friend/",async(req,res)=>{
    try{
        console.log("params for post update: ",req.body);
        const [user_id,user_id_2] = req.body;
        console.log("user_id: "+user_id+"    user 2 id: "+user_id_2);
        const result = await pool.query("INSERT INTO friends (user1,user2) VALUES ($1,$2)",[user_id,user_id_2]);
        res.json(user_id_2);
    } catch(err){
        console.log(err.message);
    }
})

router.get("/friends/posts/:id",async(req,res)=>{//get all the users interests
    try{
        console.log("params for friends posts: ",req.params);
        var user_id=req.params.id;
        console.log("user_id for friends posts",user_id);
        const result = await pool.query("SELECT * FROM posts WHERE post_id in (SELECT post_id FROM tags WHERE user_id  in (SELECT user2 from friends WHERE user1 = $1)) order by post_date desc;",[user_id]);
        console.log("friends posts results from db: ",result);
        resultArray=Object.values(result.rows);
        console.log("user interests from db: ",resultArray);

        res.json(resultArray);
    } catch(err){
        console.log(err.message);
    }
})
router.post("/post/",async(req,res)=>{
    try{
        console.log("params for post insert: ",req.body);
        const [user_id,interest,location,title,desc] = req.body;
        const result = await pool.query("INSERT INTO posts (user_id,post_interest,post_location,post_title,text) VALUES($1,$2,$3,$4,$5) RETURNING post_id ",[user_id,interest,location,title,desc]);
        const post_id = result.rows[0].post_id;
        const result_3= await pool.query("INSERT INTO tags (user_id,post_id) VALUES($1,$2) RETURNING post_id ",[user_id,post_id]);//taging the owner in the post
        console.log("post id going back from backend:",result_3.rows[0].post_id);
        res.json(post_id);
    } catch(err){
        console.log(err.message);
    }
})
router.put("/post/update/",async(req,res)=>{
    try{
        console.log("params for post update: ",req.body);
        const [image,post_id] = req.body;
        const result = await pool.query("UPDATE posts SET image = $1 WHERE post_id = $2 ",[image,post_id]);
        res.json(result);
    } catch(err){
        console.log(err.message);
    }
})
router.get("/post/:id",async(req,res)=>{//get posts tagged in (everyone is tagged in his post)
    console.log("request: ",req.params);
    var user_id=req.params.id;
    console.log("user_id for posts",user_id);
    const result = await pool.query("SELECT * FROM posts WHERE post_id in (SELECT post_id from tags WHERE user_id = $1)",[user_id]);
    console.log("user posts from db: ",result.rows);
    res.json(result.rows);
})
router.get("/post/ids/:id",async(req,res)=>{//to get users tagged in post
    console.log("request: ",req.params);
    var post_id=req.params.id;
    console.log("post id to get tagged users",post_id);
    const result = await pool.query("SELECT user_id from tags WHERE post_id = $1",[post_id]);
    console.log("users tagged in post from db: ",result);
    res.json(result.rows);
})
router.post("/post/tag/",async(req,res)=>{
    try{
        console.log("params for post update: ",req.body);
        const [user_id,post_id] = req.body;
        const result = await pool.query("INSERT INTO tags (user_id,post_id) VALUES ($1,$2) RETURNING post_id",[user_id,post_id]);
        res.json(result);
    } catch(err){
        console.log(err.message);
    }
})
router.post("/post/delete/tag/",async(req,res)=>{
    try{
        console.log("params for post update: ",req.body);
        const [user_id,post_id] = req.body;
        const result = await pool.query("DELETE FROM tags WHERE user_id = $1 AND post_id = $2",[user_id,post_id]);
        res.json(result);
    } catch(err){
        console.log(err.message);
    }
})

router.get("/post/numbers/:id",async(req,res)=>{//to get users tagged in post
    console.log("request: ",req.params);
    var post_id=req.params.id;
    console.log("post id to get user numbers",post_id);
    const result = await pool.query("SELECT phone_number FROM users WHERE user_id in (SELECT user_id from tags WHERE post_id = $1)",[post_id]);
    console.log("phone number of users in post from db: ",result);
    res.json(result.rows);
});

module.exports = router;


// router.get("/post/ids/:id",async(req,res)=>{//get posts tagged in (everyone is tagged in his post)
//     console.log("request: ",req.params);
//     var user_id=req.params.id;
//     console.log("user_id for posts",user_id);
//     const result = await pool.query(SELECT(EXISTS("SELECT post_id from tags WHERE user_id = $1)",[post_id,user_id])));
//     console.log("check if user is tagged in post ",result);
//     res.json(result.rows);
// })