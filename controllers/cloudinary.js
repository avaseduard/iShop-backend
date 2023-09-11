const cloudinary = require('cloudinary')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Upload images to cloudinary
exports.upload = async (req, res) => {
  // Cloudinary upload function takes the image that we receive from front end as first arg and a config object as the second arg; it returns the image url
  let result = await cloudinary.uploader.upload(req.body.image, {
    public_id: `${Date.now()}`,
    resource_type: 'auto', // jpeg, png, etc.
  })
  // Send the id and url to front end
  res.json({
    public_id: result.public_id,
    url: result.secure_url,
  })
}

// Remove image from cloudinary
exports.remove = async (req, res) => {
  // Get the id from front end
  let image_id = req.body.public_id
  // Remove the image based on id and send error or success
  cloudinary.uploader.destroy(image_id, (err, result) => {
    if (err) return res.json({ success: false, err })
    res.send('ok')
  })
}
