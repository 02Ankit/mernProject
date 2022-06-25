const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const employeeSchema = new mongoose.Schema({
firstname:{
    type:String,
    required:true
},

lastname:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true,
    unique:true
},
gender:{
    type:String,
    required:true
},
phone:{
    type:Number,
    unique:true,
    required:true
},
password:{
    type:String,
    required:true
},

confirmpassword:{
    type:String,
    required:true
}, 
tokens:[{
    token:{
        type:String,
        required:true
    }
}]

})

// jub bhi hum schema create karte hai to usme ek method aata hai jo ki middleware ka kam karta hai 
//isme humlog fat arrow function ka use nahi karenge sahi se kaam nahi karta hai to iske liye normal function wala concept likhenge
//ye 2 argument leta hai jisme pahele jo likhte hai wo baad me call hoga  

employeeSchema.pre("save", async function(next){

if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password, 6);
    //middleware me next() ko call karna hi padhta hai
    // this.confirmpassword = undefined
}
next();

  
})
//jub bhi hum instance ke sath work karte hai to hum methods ka use karte hai , jispe registerEmployee ek instance hai.
//or agar hum direct Register ek collection hai iske sath work karte to hum static ka use karte Register.static() hai.

//generating token
employeeSchema.methods.generateAuthToken = async function(){
try{

        console.log(this._id)
        const tokenjet = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY) 
        this.tokens = this.tokens.concat({token:tokenjet})
        await this.save();
        return tokenjet

}catch(e){
res.send("the error part" + e)
console.log("the error part" + e)
}
}


const Register = new mongoose.model("Register", employeeSchema)

module.exports = Register