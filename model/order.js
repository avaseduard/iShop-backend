const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: ObjectId,
          ref: 'Product',
        },
        count: Number,
        color: String,
      },
    ],
    paymentIntent: {},
    orderStatus: {
      type: String,
      default: 'Received',
      enum: ['Received', 'Processing', 'Sent', 'Cancelled', 'Completed'],
    },
    orderedBy: {
      type: ObjectId,
      ref: 'User',
    },
    address: String,
  },
  { timestamps: true }
)

module.exports = mongoose.model('Order', orderSchema)
