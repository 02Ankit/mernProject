require("dotenv").config()
const express = require("express");
const path = require("path")
const app = express();
require("./db/conn")
const Register = require("./models/registers")
//express ko batana padega ki hum partials ka use kar rahe hai to 
const hbs = require("hbs")
const bcrypt = require("bcryptjs")

const port = process.env.PORT || 3000
//current jis file me hai uska path show hota hai 
// const static_path = path.join(__dirname)
//is liye hume to Html wale file ko lana hai matlab ki join karwana hai index.html ko app.js se then use 
const static_path = path.join(__dirname,"../public")
const template_path = path.join(__dirname, "../templates/views")
const partials_path = path.join(__dirname, "../templates/partials")

// postman ke liye perfect hai but HTML form k liye nahi to ?
app.use(express.json());
//ab HTML form se jo bhi data aa raha hai use hume get karna hai to hum yaha urlencoder({extended:false}) ke under extended ko false karenge tub hume ye undefine nahi karega
app.use(express.urlencoded({extended:false})) 

//iska use static pages ko lane k liye hota hai 
app.use(express.static(static_path))
app.set("view engine", "hbs"); //but hum dynamic page template engine ka use kar rahe hai to iske liye 
app.set("views", template_path)
hbs.registerPartials(partials_path)

console.log(process.env.SECRET_KEY)

app.get("/", (req, res)=>{
    
    // res.send("hello ankit Tech")

    //hum template engine use kar rahe hai is liye render() function ka use hoga nahi to send() ka use kar sakte hai 
    res.render("index")

    console.log("hello ankit Tech")
})

app.get("/register", (req, res)=>{
    
    // res.send("hello ankit Tech")

    //hum template engine use kar rahe hai is liye render() function ka use hoga nahi to send() ka use kar sakte hai 
    res.render("register")

    console.log("hello ankit Tech")
})

app.get("/login", (req, res)=>{
    
    // res.send("hello ankit Tech")

    //hum template engine use kar rahe hai is liye render() function ka use hoga nahi to send() ka use kar sakte hai 
    res.render("login")

    console.log("hello ankit Tech")
})

//form se jo bhi POST req ayega use yaha lana hai 
app.post("/register", async(req, res)=>{
try {
    
const password = req.body.password
const cpassword = req.body.confirmpassword

if(password == cpassword){

            const registerEmployee = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: password,
                confirmpassword: cpassword
            })
//hume save karne se pahele password ko encrypt karna hoga
// jise middleware kahete hai 

console.log(registerEmployee)

const token  = await registerEmployee.generateAuthToken()

console.log(token)


       const registered = await registerEmployee.save();

           
            res.status(201).render("login")


        }else{
            res.send("password are not matching")
        }
} catch (error) {
    res.status(500).send("Server Error")
}
})

app.post("/login", async(req, res)=>{
    try {
    
        const email = req.body.email
        const password = req.body.pswd
        console.log(password)
        //object Destructuring bolta hai ki database ka email: req.body.email(email:email) same ho to {email} likh do. 
        const getData = await Register.findOne({email:email})
        // console.log(getData.password)  
        // console.log(password)  
        const isMatch = await bcrypt.compare(password, getData.password)
        const token  = await getData.generateAuthToken()

        console.log(token)

      if(isMatch){
        
        res.status(201).render("index")
      }else{
        res.send("invalid login details")
      }

       
        } catch (error) {
            res.status(400).send("invalid login details")
        }
    })

// const bcrypt = require("bcryptjs")

// const securePassword =  async (password) => {

//     const passwordHash = await bcrypt.hash(password, 6);
//     console.log(passwordHash)

//     const passwormatch = await bcrypt.compare("ankit", passwordHash);
//     console.log(passwormatch)
// }

// securePassword("Ankit")


app.listen(port, ()=>{

    console.log(`Connection ${port} is Successful`)
})