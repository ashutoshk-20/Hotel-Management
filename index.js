import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import Client from "pg";

const __dirname=dirname(fileURLToPath(import.meta.url));

const app=express();
const port=3000;
const client=new Client.Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "1234",
    database: "postgres"
})

client.connect()

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/public/index.html");
})

app.post("/confirm",(req,res)=>{
    var fName=req.body["fname"];
    console.log(fName);
    var lName=req.body["lname"];
    var add1=req.body["add1"];
    var add2=req.body["add2"];
    var city=req.body["city"];
    var state=req.body["state"];
    var pincode=req.body["pincode"];
    pincode=parseInt(pincode);
    console.log(pincode);
    var phnumber=req.body["phNumber"];
    var email=req.body["email"];
    var a_date=req.body["a_date"];
    var a_time=req.body["a_time"];
    var d_date=req.body["d_date"];
    var d_time=req.body["d_time"];
    var adult=req.body["adults"];
    adult=parseInt(adult);
    var kids=parseInt(req.body["kids"]);
    var payment=0;
    if(req.body["cash"]){
        payment=0;
    }
    else if(req.body["paypal"]){
        payment=1;
    }
    else{
        payment=2;
    }

    client.query(`insert into users values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,[fName,lName,add1,add2,city,state,pincode,phnumber,email,a_date,a_time,d_date,d_time,adult,kids,payment],(err,res)=>{
        if(!err){
            console.log(res.rows);
        } else{
            console.log(err.message);
        }
        client.end;
    })
    
    res.redirect("/");
});

app.post("/availabilityStatus",(req,res)=>{
    var a_date=req.body["arrivald"];
    var d_date=req.body["departured"];
    var persons=parseInt(req.body["ad"])+parseInt(req.body["child"]);
    var status='A';
    var rooms=0;
    client.query(`select * from rooms where ("status"=$1 or "ddate"<=$3) and "capacity">=$2`,[status,persons,a_date],(err,result)=>{
        if(!err){
            console.log(result.rows.length);
            rooms=result.rows.length;
            res.send(`<script>alert("${rooms} rooms are available"); window.location.href = "/";</script>`);
        }
        else{
            console.log(err.message);
            res.send(`<script>alert("Error occurred while checking availability"); window.location.href = "/";</script>`);
        }
        client.end;
    });
});

app.listen(port,()=>{
    console.log(`Listening the port ${port}.`);
})

