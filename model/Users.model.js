const mongoose=require("mongoose");

const userSchema=mongoose.Schema({
    email:String,
    password:String,
    funds:Number,
    role:String
});

const UserModel=mongoose.model("users",userSchema);

module.exports={
    UserModel
}