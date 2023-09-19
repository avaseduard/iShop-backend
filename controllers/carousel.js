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
    res.status(400).json({
      error: error.message,
    })
  }
}
