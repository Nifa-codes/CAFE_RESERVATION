const asyncHandler = require("../middleware/asyncHandler");

function orderController(orderService) {
  const addOrder = asyncHandler(async function (req, res) {
    const { items, status, total_price } = req.body;
    const orderData = { items, status, total_price };
    const result = await orderService.addOrder(orderData);
    return res.status(201).json({ result });
  });

  const editOrder = asyncHandler(async function (req, res) {
    const id = req.params.id;
    const { items, status, total_price } = req.body;
    const orderData = { items, status, total_price };
    const result = await orderService.editOrder(id, orderData);
    return res.status(200).json({ message: result });
  });

  const deleteOrder = asyncHandler(async function (req, res) {
    const id = req.params.id;
    const result = await orderService.deleteOrder(id);
    return res.status(200).json({ message: result });
  });

  return { addOrder, editOrder, deleteOrder };
}

module.exports = { orderController };
