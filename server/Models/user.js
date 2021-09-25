const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Role = require('../helpers/role');

const userSchema = new Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    role: {
        type:String,
        default: Role.User,
        enum: [Role.User, Role.Admin]
    }
    
})

module.exports = mongoose.model('User',userSchema);