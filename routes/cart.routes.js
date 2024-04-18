const express= require('express')
const { auth } = require('../middlewares/auth.middleware')
const { ProductModel } = require('../model/product.model')
const cartRouter = express.Router()
//productRouter.use(auth)

cartRouter.get("/",async(req,res)=>{

    try {
        const products = await ProductModel.find({userID:req.body.userID});
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
    const products= new ProductModel({  title ,image,desc,category,price,userID:userID, username})
    await products.save()
    res.status(201).json({msg:"A new product has been added",products})
    }catch{
        res.status(500).json({msg:"Error saving product"})

    }
})

module.exports={cartRouter}