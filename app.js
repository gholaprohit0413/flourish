const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const nodemailer = require("nodemailer");

const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname));

app.use(session({
secret:"flourishSecret",
resave:false,
saveUninitialized:true
}));

/* DATABASE */

mongoose.connect("mongodb://127.0.0.1:27017/flourishDB")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

/* BOOKING MODEL */

const bookingSchema = new mongoose.Schema({
name:String,
email:String,
date:String,
service:String
});

const Booking = mongoose.model("Booking",bookingSchema);

/* EMAIL */

const transporter = nodemailer.createTransport({
service:"gmail",
auth:{
user:"gholaprohit75@gmail.com",
pass:"cyeqzjnvuekweizz"
}
});

/* LANDING */

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "landing.html"));
});

/* CUSTOMER LOGIN */

app.get("/customer-login",(req,res)=>{
res.sendFile(path.join(__dirname,"customer-login.html"));
});

app.post("/customer-login",(req,res)=>{

const {email,password}=req.body;

if(email==="user@gmail.com" && password==="1234"){
res.sendFile(path.join(__dirname,"index.html"));
}else{
res.send("Customer Login Failed");
}

});

/* OWNER LOGIN */

app.get("/login",(req,res)=>{
res.send(`
<h2>Owner Login</h2>
<form method="POST" action="/login">
<input name="username" placeholder="Username" required/>
<input name="password" type="password" placeholder="Password" required/>
<button type="submit">Login</button>
</form>
`);
});

app.post("/login",(req,res)=>{

const {username,password}=req.body;

if(username==="admin" && password==="1234"){
req.session.admin=true;
res.redirect("/admin");
}else{
res.send("Login Failed");
}

});

/* BOOKING */

app.post("/book",async(req,res)=>{

const {name,email,date,service}=req.body;

const booking=new Booking({name,email,date,service});

await booking.save();

await transporter.sendMail({
from:"gholaprohit75@gmail.com",
to:"gholaprohit75@gmail.com",
subject:"New Booking",
html:`
<h2>New Booking</h2>
<p>Name:${name}</p>
<p>Email:${email}</p>
<p>Date:${date}</p>
<p>Service:${service}</p>
`
});

res.send("Booking Confirmed");

});

/* ADMIN DASHBOARD */

app.get("/admin",async(req,res)=>{

if(!req.session.admin){
return res.redirect("/login");
}

const bookings=await Booking.find();

let html=`
<h1>Admin Dashboard</h1>
<table border="1">
<tr>
<th>Name</th>
<th>Email</th>
<th>Date</th>
<th>Service</th>
</tr>
`;

bookings.forEach(b=>{
html+=`
<tr>
<td>${b.name}</td>
<td>${b.email}</td>
<td>${b.date}</td>
<td>${b.service}</td>
</tr>
`
});

html+=`</table><br><a href="/logout">Logout</a>`;

res.send(html);

});

/* LOGOUT */

app.get("/logout",(req,res)=>{
req.session.destroy(()=>{
res.redirect("/");
});
});

/* SERVER */

app.listen(3000,()=>{
console.log("Server Running http://localhost:3000");
});