const express = require('express');

const cors = require('cors');

const cloudinary = require("cloudinary").v2;

const app = express();

app.use(cors())
require("dotenv").config()

const { connection } = require('./db');
const { userRouter } = require('./routes/user.routes');
const { productRouter } = require('./routes/products.routes');
const { categoryRouter } = require('./routes/category.routes');
const { cartRouter } = require('./routes/cart.routes');

app.use(express.json())

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

  

app.get("/", (req, res) => {
  res.send({ message: "File upload using multer" });
});


app.get("/",(req,res)=>{
   res.send("Welcome");
})
app.use("/users",userRouter)
app.use("/products", productRouter)
app.use("/category", categoryRouter)
app.use("/cart", cartRouter)

app.listen(process.env.port||4000,async()=>{
    try{
        await connection
    console.log('Connected to DB!');

    }
    catch(err){
console.log("Unable to connect to DB",err.message);
    }
})
//https://arba-be-myn8.onrender.com/