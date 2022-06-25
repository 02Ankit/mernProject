const mongoose = require("mongoose")

//return promise
mongoose.connect("mongodb://localhost:27017/loginRegistration", {
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("DataBase Connection Succesful")
}).catch((e)=>{
    console.log(e)
})