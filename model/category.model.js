
const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
      
    },
    size: {
        type: String,
        required: [true, 'Size is required'],
       
    },
    image: {
        type: String,
        default: false
    },
    
    userID:String,
    username:String
    
}, {
    versionKey: false
});

const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = { CategoryModel };