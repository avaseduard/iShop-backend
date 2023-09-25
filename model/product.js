const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
      text: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
      text: true,
    },
    price: {
      type: Number,
      trim: true,
      required: true,
      maxlength: 32,
    },
    category: {
      type: ObjectId,
      ref: 'Category',
    },
    subcategories: [
      {
        type: ObjectId,
        ref: 'Subcategory',
      },
    ],
    quantity: Number,
    sold: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
    },
    shipping: {
      type: String,
      enum: ['Yes', 'No'], // enum means it has to be either one of these two values
    },
    color: {
      type: String,
      enum: [
        'White',
        'Black',
        'Grey',
        'Yellow',
        'Red',
        'Blue',
        'Green',
        'Brown',
        'Pink',
        'Orange',
        'Purple',
      ],
    },
    brand: {
      type: String,
      enum: ['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'ASUS'],
    },
    ratings: [
      {
        star: Number,
        postedBy: {
          type: ObjectId,
          ref: 'User',
        },
      },
    ],
  },
  { timestamps: true }
)

module.exports = mongoose.model('Product', productSchema)
