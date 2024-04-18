const express= require('express')
const { auth } = require('../middlewares/auth.middleware')
const productRouter = express.Router()

productRouter.use(auth)

const { ProductModel } = require('../model/product.model')
const cloudinary = require("cloudinary").v2;


const multer = require("multer");

const fs=require('fs');
const { url } = require('inspector');
const { CategoryModel } = require('../model/category.model');

const storage = multer.memoryStorage();

const upload = multer({ storage });


productRouter.get("/",async(req,res)=>{
    const userID = req.body.userID;
    const username = req.body.username;
    console.log(userID,username,"req");
    try {
        const products = await ProductModel.find({userID:req.body.userID});
        res.status(200).json({msg:"Success",products});
      } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'An error occurred while fetching products' });
      }
})

  
productRouter.post("/",[upload.single("profile"),auth], (req, res) => {
  const userID = req.body.userID;
  const username = req.body.username;
  console.log(userID,username,"req");
  console.log(req.body,"req bodyyyyyyyyyyyyyyyyyyy");
  const { title, desc, category, price } = req.body;
  try {
      const fileBuffer = req.file.buffer;
      const timestamp = new Date().getTime();
      const uniqueId = Math.floor(Math.random() * 100000);
      const publicId = `image_${timestamp}_${uniqueId}`;

      cloudinary.uploader.upload_stream(
          {
              public_id: publicId,
              folder: "imageuploadtesting"
          },
          async(err, result) => {
              if (err) {
                  console.error("Error uploading image to Cloudinary:", err);
                  return res.status(500).json({ message: "Error uploading image" });
              }
              const cat= await CategoryModel.findOne({name:category})

              const product = new ProductModel({
                  image: result.url,
                  title,
                  desc,
                  category:cat._id,
                  price,
                  userID,
                  username
              });
              product.save()
                  .then(savedProduct => {
                      res.status(201).json({ msg: "A new product has been added", product: savedProduct, url: result.url });
                  })
                  .catch(error => {
                      console.error("Error saving product to database:", error);
                      res.status(500).json({ message: "Error saving product to database" });
                  });
          }
      ).end(fileBuffer);
  } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).json({ message: "Error processing request" });
  }
})

    productRouter.delete("/delete/:id",async(req,res)=>{
        let ID=req.params.id
        let data =await ProductModel.findOne({_id:ID})
        let userID_post=data.userID
        let userID_req=req.body.userID
        try {
            
                 if((userID_post==userID_req)){
                    await ProductModel.findByIdAndDelete({
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

    

    

    productRouter.patch("/edit/:id",async(req,res)=>{
        let ID=req.params.id
        let payload=req.body
        let data =await ProductModel.findOne({_id:ID})
        let userID_post=data.userID
        let userID_req=req.body.userID
        try {
                 if((userID_post==userID_req)){
                    await ProductModel.findByIdAndUpdate({
                     _id:ID
                },payload)
                res.send(`data with ${ID} is updated`)
            }else{
                res.send("Not authorized")
            }
            
        } catch (error) {
            res.send(error)
        }
    })
  

  
   
module.exports={
    productRouter
}