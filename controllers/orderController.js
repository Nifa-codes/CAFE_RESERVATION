/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */
function orderController(orderService) {
   /**
   * @swagger
   * /api/orders/add:
   *   post:
   *     summary: Add a new order
   *     description: Create an order with items, status, and total price
   *     tags: [Orders]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               items:
   *                 type: array
   *                 description: Array of order items.
   *               status:
   *                 type: string
   *               total_price:
   *                 type: number
   *             required:
   *               - items
   *               - status
   *               - total_price
   *             example:
   *               items: [{ productId: "p1", quantity: 2 }]
   *               status: "pending"
   *               total_price: 20.5
   *     responses:
   *       201:
   *         description: Order added successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Order added successfully"
   *       500:
   *         description: Error adding order.
   */
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
 /**
   * @swagger
   * /api/orders/edit/{id}:
   *   put:
   *     summary: Update an order
   *     description: Edit the details of an existing order.
   *     tags: [Orders]
   *     parameters:
   *       - in: path
   *         name: id
   *         description: Order ID.
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               items:
   *                 type: array
   *               status:
   *                 type: string
   *               total_price:
   *                 type: number
   *             example:
   *               items: [{ productId: "p1", quantity: 3 }]
   *               status: "completed"
   *               total_price: 30.0
   *     responses:
   *       200:
   *         description: Order updated successfully.
   *       500:
   *         description: Error updating order.
   */
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
   /**
   * @swagger
   * /api/orders/delete/{id}:
   *   delete:
   *     summary: Delete an order
   *     description: Delete an order using its ID.
   *     tags: [Orders]
   *     parameters:
   *       - in: path
   *         name: id
   *         description: Order ID.
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Order deleted successfully.
   *       500:
   *         description: Error deleting order.
   */
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
  