const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
  userId:{
    type: String,
    required: true,
  },
  description:{
    type: String,
    max: 600
  },
  image:{
    type: String,
  },
  likes:{
    type: Array,
    default: []
  }

},
 
{timestamps: true}
);

module.exports = mongoose.model("Post",postSchema);