const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

// Create an user schema for the database
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      require: true,
      index: true,
    },
    role: {
      type: String,
      default: 'subscriber',
    },
    cart: {
      type: Array,
      default: [],
    },
    address: {
      type: String,
    },
    addresses: [
      {
        location: {
          type: String,
          trim: true,
        },
        slug: {
          type: String,
          lowercase: true,
        },
      },
    ],
    wishlist: [{ type: ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', userSchema)
