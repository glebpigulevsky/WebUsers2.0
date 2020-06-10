const {Schema, model} = require('mongoose');

const schema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  dateRegistration:{
    type:Date,
    default: Date.now,
  },
  lastLogin:{
    type:Date,
    default: Date.now,
  },
  blocked: {
    type: Boolean,
    default: false,
  }
  
},
{
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
});

module.exports = model('User', schema)