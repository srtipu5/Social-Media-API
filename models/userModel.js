const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username:{
    type: String,
    required: true,
    min: 5,
    max: 20,
    unique: true
  },
  email:{
    type: String,
    required: true,
    max: 40,
    unique: true
  },
  password:{
    type: String,
    required: true,
    min: 5,
  },
  age: Number,
  gender:{
    type: Number,
    enum: [1,2,3],
  },
  profilePic:{
    type: String,
    default: ""
  },
  coverPic:{
    type: String,
    default: ""
  },
  followers:{
    type: Array,
    default: []
  },
  followings:{
    type: Array,
    default: []
  },
  isAdmin:{
    type: Boolean,
    default: false
  },
  country:{
    type: String,
    max: 30,
  },
  city:{
    type: String,
    max: 20,
  },
  relationship:{
    type: Number,
    enum: [1,2,3],
  },
  description:{
    type: String,
    max: 300,
  }
 
},
{timestamps: true}
);

module.exports = mongoose.model("User",userSchema);