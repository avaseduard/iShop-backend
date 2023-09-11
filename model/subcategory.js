const mongoose = require('mongoose')
const { ObjectId } = mongoose

// trim removes blanks form beginning and end
const subcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
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
    parent: {
      type: ObjectId,
      ref: 'Category',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Subcategory', subcategorySchema)
