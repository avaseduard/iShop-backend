const mongoose = require('mongoose')

const carouselSchema = new mongoose.Schema(
  {
    images: {
      type: Object,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Carousel', carouselSchema)
