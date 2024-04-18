const mongoose = require('mongoose')

const userSchema= mongoose.Schema({
email: {required: true, unique: true ,type:String},
username:String,
pass:String
},{
    versionKey:false
})

const UserModel= mongoose.model("User",userSchema)

module.exports = {UserModel}