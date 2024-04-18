
const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
      
    },
    desc: {
        type: String,
        required: [true, 'Description is required'],
       
    },
    price: {
        type: Number,
        default: false
    },
    category: {
        type: mongoose.Schema.Types.ObjectId, ref:'Category'
    }, 
    image: {
        type: String,
    },
    userID:String,
    username:String
    
}, {
    versionKey: false
});

const ProductModel = mongoose.model("Product", productSchema);

module.exports = { ProductModel };