function orderController(orderService) {
    const addOrder = async function(req, res) {
      try {
        const { items, status, total_price } = req.body;
        const orderData = { items, status, total_price };
        const result = await orderService.addOrder(orderData);
        return res.status(201).json({ result });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }
  
    const editOrder = async function(req, res) {
      try {
        const id = req.params.id;
        const { items, status, total_price } = req.body;
        const orderData = { items, status, total_price };
        const result = await orderService.editOrder(id, orderData);
        return res.status(200).json({ message: result });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }
  
    const deleteOrder = async function(req, res) {
      try {
        const id = req.params.id;
        const result = await orderService.deleteOrder(id);
        return res.status(200).json({ message: result });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }
  
    return { addOrder, editOrder, deleteOrder };
  }
  
  module.exports = { orderController };
  