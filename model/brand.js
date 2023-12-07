const mongoose = require('mongoose')

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true, // removes blanks from beginning and end
      required: 'Name is required',
      minlength: [2, 'too short'], // message if it's shorter than 2 characters
      maxlength: [32, 'too long'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Brand', brandSchema)
