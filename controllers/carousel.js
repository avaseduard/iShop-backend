const Carousel = require('../model/carousel')

// Save resized image from fe to database
exports.addImage = async (req, res) => {
  try {
    const newImage = await new Carousel({
      images: req.body,
    }).save()
    // Send the response to fe
    res.json({ ok: true })
  } catch (error) {
    console.log('CAROUSEL IMAGE UPLOAD FAILED BE -->', error)
  }
}

// Get all images from database
exports.getAllImages = async (req, res) => {
  try {
    const images = await Carousel.find({}).exec()
    res.json(images)
  } catch (error) {
    console.log('CAROUSEL GET ALL IMAGES FAILED BE -->', error)
  }
}

// Remove image from database
exports.removeImage = async (req, res) => {
  try {
    const deleted = await Carousel.findOneAndDelete({
      'images.public_id': req.body.imageId,
    })
    res.json({ ok: true })
  } catch (error) {
    console.log('CAROUSEL REMOVE IMAGE FAILED BE -->', error)
  }
}
