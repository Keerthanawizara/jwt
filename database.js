

// Set up mongoose connection
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/test",{useNewUrlParser: true}, err => {
    if(!err){
        console.log('mongodb connection success')
    }else{
        console.log('error:'+ err)
    }
});

module.exports = mongoose;
