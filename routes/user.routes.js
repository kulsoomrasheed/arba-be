const express= require('express')
const userRouter = express.Router()
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');
const { UserModel } = require('../model/user.model');

userRouter.get("/",async(req,res)=>{
    try{
            const users=await UserModel.find()
    res.status(200).json({users})
    }
    catch(e){
        res.status(500).json({error: e})
    }

})


userRouter.post("/register",(req,res)=>{
    const {username,email,pass}= req.body
   try{
    
 bcrypt.hash(pass,5,async(err,hash)=>{
        if (err){
            res.status(404).json({err})
        }else{
            const user= new UserModel({email,username,pass:hash})
            await user.save()
            res.status(200).send("A new user has been registered!")
        }
    }) 
   
   }catch(error){
   
        console.log(error)
        res.send(error.message);
      }
   
})

userRouter.post("/login",async(req,res)=>{
    const {username,pass}=req.body
    try{
   const user = await UserModel.findOne({username})
   console.log(user,'***************');
if (user){
    bcrypt.compare(pass,user.pass,(err,result)=>{
        if (result){
            let token = jwt.sign({userID:user._id,username:user.username},process.env.secret)
            res.json({msg:"Login Successful!!!", token})

        }else{
            res.status(400).json({msg:"Invalid Credentials"})

        }
    })
}else{
    res.status(400).json({msg:"User does not exist"})

}
    }catch(err){
    res.json({err:err.message})
    }
})
userRouter.get("/",async(req,res)=>{
    try {
        const users = await UserModel.find();
        res.status(200).json({msg:"Success",users});
      } catch (error) {
        console.log('Error fetching tasks:', error.message);
        res.status(500).json({ error: 'An error occurred while fetching users' });
      }
})
userRouter.patch("/edit/:id",async(req,res)=>{
    let ID=req.params.id
    let payload=req.body
    let data =await UserModel.findOne({_id:ID})
    let userID_post=data.userID
    let userID_req=req.body.userID
    try {
             if((userID_post==userID_req)){
                await UserModel.findByIdAndUpdate({
                 _id:ID
            },payload)
            res.send(`user with ${ID} is updated`)
        }else{
            res.send("Not authorized")
        }
        
    } catch (error) {
        res.send(error)
    }
})

module.exports={
    userRouter
}