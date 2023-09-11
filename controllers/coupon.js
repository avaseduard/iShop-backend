const Coupon = require('../model/coupon')

exports.create = async (req, res) => {
  try {
    const { name, expiry, discount } = req.body.coupon
    const generatedCoupon = await new Coupon({ name, expiry, discount }).save()
    res.json(generatedCoupon)
  } catch (error) {
    console.log('COUPON BE CREATE ERROR -->', error)
  }
}

exports.list = async (req, res) => {
  try {
    const filteredCoupons = await Coupon.find({}).sort({ createdAt: -1 }).exec()
    res.json(filteredCoupons)
  } catch (error) {
    console.log('COUPON BE LIST ERROR -->', error)
  }
}

exports.remove = async (req, res) => {
  try {
    const deletedCoupon = await Coupon.findByIdAndDelete(
      req.params.couponId
    ).exec()
    res.json(deletedCoupon)
  } catch (error) {
    console.log('COUPON BE REMOVE ERROR -->', error)
  }
}
