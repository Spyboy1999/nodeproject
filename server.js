const express = require("express");
const app = express();
const mysql = require("mysql");
const session= require("express-session")
const sqlSession= require("express-mysql-session")(session)
app.set("views engine","ejs")
const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config()
const { profile } = require("console");
app.use("/", express.static(path.join(__dirname, "/public")));
const connDB = mysql.createConnection({
  host:process.env.HOST ,
  user:process.env.DB_USER,
  password:process.env.DB_PASS,
  database:process.env.DB_NAME,
  port:process.env.PORT,
  connectTimeout: 300000
});
connDB.connect((err) => {
  if (err) throw err;
  console.log("connection successful");
});
app.use(express.urlencoded({ extended: false }));

const isAuth=(req,res,next)=>{
  if(req.session.isAuth){
    next()
  }
  else{
    res.redirect("/login")
  }
}
let storeSession=new sqlSession({
expiration:10800000,
createDatabaseTable:true,
schema:{
  tableName:"sessionData",
  columnNames:{
    session_id:"session_id",
    data:"data",
    expires:"expires"
  }
}
},connDB)
app.use(session({
  resave:false,
  saveUninitialized:false,
  secret:"i love nodejs with sql",
  key:"mykey",
  store:storeSession
 
}))

app.get("/reset",(req,res)=>{
  res.render(path.join(__dirname,"views","reset.ejs"))
})
app.get("/createDB", (req, res) => {
  let queryData = "CREATE DATABASE firstDB";
  connDB.query(queryData, (err) => {
    if (err) throw err;
    res.write("database created succesfully");
  });
});
app.get("/home/profile",(req,res)=>{
  const sql=`SELECT * FROM customer WHERE Email=?`;
  connDB.query(sql,[req.session.user],(err,result)=>{
    if(err) throw err;
console.log(result)
  res.render(path.join(__dirname,"views","profile.ejs"),{Email:result})
  
})
})
app.get("/register", (req, res) => {
  res.render(path.join(__dirname,"views","register.ejs"));
});
app.get("/login", (req, res) => {
  res.render(path.join(__dirname, "views", "login.ejs"));
});
app.get("/home",isAuth, async(req,res)=>{

  
  const sql=`SELECT * FROM customer`;
  connDB.query(sql,(err,result)=>{
    if(err) throw err;
res.render(path.join(__dirname,"views","home.ejs"),{data:result,user:req.session.user})
  })
    
})
app.post("/logout", async(req,res)=>{
  const logout= await req.body.logout
  console.log(logout)
  req.session.destroy((err)=>{
if(err){
    throw err;
};
res.redirect("/login")
  } 

)
  
 
})
app.post("/login", (req, res) => {
  let { email, pass } = req.body;

  let sql = "SELECT COUNT(*) AS count FROM customer WHERE Email=? AND Pass=?";
  connDB.query(sql, [email, pass], (err, result) => {
    if (err) throw err;
    const FoundUser = result[0].count > 0;
    if (FoundUser) {
      //res.sendFile(path.join(__dirname,"views","home.html"))
      req.session.isAuth=true
      req.session.user=email;
        res.redirect("/home")
    } else {
      res.sendStatus(401);
    }
  });
});

app.post("/register", (req, res) => {
  const { email, pass } = req.body;
  let duplicate = `SELECT COUNT(*) AS count FROM customer WHERE Email=?`;
  connDB.query(duplicate, [email], (err, result) => {
    if (err) throw err;

    const exists = result[0].count > 0;
    if (exists) {
      res.send("email already exist");
    } else {
      let data = { Email: email, Pass: pass };
      let store = `INSERT INTO customer SET?`;
      connDB.query(store, data, (err, result) => {
        if (err) throw err;
        res.send("user created successfully");
        res.redirect("/login")
      }); //
    }
  }); //
}); //

//
app.get("/customer", (req, res) => {
  let createTable =
    "CREATE TABLE customer (Id INT AUTO_INCREMENT,Email VARCHAR(255),Pass VARCHAR(256),PRIMARY KEY(id))";
  connDB.query(createTable, (err) => {
    if (err) throw err;
    res.send("table created");
  });
});

app.get("/insert", (req, res) => {
  // const select="SELECT * FROM student"
  // const checkDup=connDB.query(select,(err,result)=>{
  //     checkDup.find(user=>user.name=user)
  // })
  let data = { name: "abdulrasaq", age: 35 };
  let post = "INSERT INTO student SET?";
  connDB.query(post, data, (err, result) => {
    if (err) throw err;
    res.send("data added successfully");
    console.log(result);
  });
});
app.get("/table2", (req, res) => {
  let table2 =
    "CREATE TABLE  grade(Id INT AUTO_INCREMENT PRIMARY KEY, course VARCHAR(256),score VARCHAR(256) )";
  connDB.query(table2, (err) => {
    if (err) throw err;
    res.send("table grade created");
  });
});
app.get("/retrive", (req, res) => {
  let retrive = " SELECT * FROM student ORDER BY Name DESC";
  connDB.query(retrive, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});
app.get("/retrivesome", (req, res) => {
  let retrivesome = "SELECT * FROM student WHERE Name LIKE 'c%'";
  connDB.query(retrivesome, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});
app.get("/details", (req, res) => {
  let request = "SELECT * FROM student";
  connDB.query(request, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});
app.get("/connectTable", (req, res) => {
  let connectTable =
    " SELECT student.Name AS student , grade.Name AS grade FROM student  JOIN grade ON student.Name=grade.Name";
  connDB.query(connectTable, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});
app.get("/student/:id", (req, res) => {
  let newName = "new Name";
  let sql = `UPDATE student SET Name='${newName}' WHERE Id = ${req.params.id}`;
  connDB.query(sql, (err, result) => {
    if (err) throw err;
    res.send("change complete");
    console.log(result.affectedRows + " row is affected");
  });
});
app.get("/mail", (req, res) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "abdulrasaqazeez1999@gmail.com",
      pass: "krgg tbnc xxje zakk",
    },
  });
  let mailOption = {
    from: "abdulrasaqazeez1999@gmail.com",
    to: "abdulrasaq.m1700494@st.futminna.edu.ng",
    subject: "this message is testing one 123",
    text: "i love you",
  };
  transporter.sendMail(mailOption, (err, info) => {
    if (err) throw err;
    res.send("the  response" + info.response);
  });
});
app.get("/delete/:id", (req, res) => {
  let ID = req.params.id;
  let sql = `DELETE FROM student WHERE Id='${ID}'`;
  const deleteQuery = connDB.query(sql, (err) => {
    if (err) throw err;
    res.send("user deleted completed");
  });
});
const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
  console.log(`the server is running on port ${PORT}`);
});
