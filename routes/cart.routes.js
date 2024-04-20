const express= require('express')
const { auth } = require('../middlewares/auth.middleware')
const { CartModel } = require('../model/product.model')
const cartRouter = express.Router()
cartRouter.use(auth)
cartRouter.get("/",async(req,res)=>{

    try {
        const products = await CartModel.find({userID:req.body.userID});
        res.status(200).json({msg:"Success",products});
      } catch (error) {
        console.error('Error fetching cart products:', error);
        res.status(500).json({ error: 'An error occurred while fetching products' });
      }
})

cartRouter.post("/",async(req,res)=>{
   const userID = req.body.userID;
   const username=req.body.username
   console.log(userID);
    const { title ,image,desc,category,price} = req.body;
    try{
    const products= new CartModel({  title ,image,desc,category,price,userID:userID, username})
    await products.save()
    res.status(201).json({msg:"A new product has been added",products})
    }catch{
        res.status(500).json({msg:"Error saving product"})

    }
})



cartRouter.delete("/delete/:id",async(req,res)=>{
  let ID=req.params.id
  let data =await CategoryModel.findOne({_id:ID})
  let userID_post=data.userID
  let userID_req=req.body.userID
  try {
      
           if((userID_post==userID_req)){
              await CartModel.findByIdAndDelete({
               _id:ID
          })
          res.status(200).send(`product with ${ID} is deleted`)
      }else{
          res.status(404).send("Not authorized")
      }
      
  } catch (error) {
      res.status(500).send(error)
  }
})
module.exports={cartRouter}