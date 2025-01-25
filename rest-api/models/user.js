const mongoose = require('mongoose');


 const userSchema = new mongoose.schema({
    name: {
        type: string, 
    },
    email: {
        required: true, 
        type: string,

    },
    age: Number
 })
 module.exports = mongoose.model("user", userSchema)