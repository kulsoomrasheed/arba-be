const express= require('express')
const mongoose=require("mongoose")
const { auth } = require('../middlewares/auth.middleware')
const { CategoryModel } = require('../model/category.model');
const categoryRouter = express.Router()
const cloudinary = require("cloudinary").v2;


const multer = require("multer");

const fs=require('fs');
const { url } = require('inspector');
const { Schema } = require('mongoose');
const { ProductModel } = require('../model/product.model');
const { log } = require('console');

const storage = multer.memoryStorage();

const upload = multer({ storage });
categoryRouter.use(auth)

categoryRouter.get("/",async(req,res)=>{

    try {
        const products = await CategoryModel.find({userID:req.body.userID});
        res.status(200).json({msg:"Success",products});
      } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'An error occurred while fetching products' });
      }
})




  
categoryRouter.post("/", auth, [upload.single("profile"), auth], async (req, res) => {
  const userID = req.body.userID;
  const username = req.body.username;
  const { size, name } = req.body;

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
          async (err, result) => {
              if (err) {
                  console.error("Error uploading image to Cloudinary:", err);
                  return res.status(500).json({ message: "Error uploading image" });
              }

              try {
                  const product = new CategoryModel({
                      image: result.url,
                      size,
                      name,
                      userID,
                      username
                  });

                  const savedProduct = await product.save();

                  const objId = new mongoose.Types.ObjectId(savedProduct.id);

                  await ProductModel.updateOne(
                      { _id: userID }, 
                      { $push: { category: objId } }
                  );

                  res.status(201).json({
                      msg: "A new product has been added",
                      product: savedProduct,
                      url: result.url
                  });
              } catch (error) {
                  console.error("Error saving product to database:", error);
                  res.status(500).json({ message: "Error saving product to database" });
              }
          }
      ).end(fileBuffer);
  } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).json({ message: "Error processing request" });
  }
});

  

    categoryRouter.delete("/delete/:id",async(req,res)=>{
        let ID=req.params.id
        let data =await CategoryModel.findOne({_id:ID})
        let userID_post=data.userID
        let userID_req=req.body.userID
        try {
            
                 if((userID_post==userID_req)){
                    await CategoryModel.findByIdAndDelete({
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


module.exports={categoryRouter}