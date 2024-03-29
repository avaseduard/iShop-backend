const Order = require('../model/order')

exports.orders = async (req, res) => {
  const allOrders = await Order.find({})
    .sort('-createdAt')
    .populate('products.product')
    .exec()

  res.json(allOrders)
}

exports.orderStatus = async (req, res) => {
  const { orderId, orderStatus } = req.body

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { orderStatus },
    { new: true }
  ).exec()
  
  res.json(updatedOrder)
}
