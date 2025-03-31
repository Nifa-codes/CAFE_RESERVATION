const generate = require('../securities/generators');

function orderService(orderRepository) {
  const addOrder = async function(orderData) {
    try {
        const priceRegEx = /^\d+$/;
        if(!priceRegEx.test(orderData.total_price)) {
          throw new Error('Price Is not valid');
        }
      if (!orderData.items || !orderData.status || !orderData.total_price) {
        throw new Error('Items, Status, and Total Price are required');
      }
      const newOrder = {
        id: generate.generateId(),
        items: orderData.items,
        status: orderData.status,
        total_price: orderData.total_price
      };
      await orderRepository.addOrder(newOrder);
      return { message: 'Order added successfully' };
    } catch (error) {
      console.error(error);
      throw new Error(`Error adding order: ${error.message}`);
    }
  }

  const editOrder = async function(id, orderData) {
    try {
      const validOrder = await orderRepository.order_id_isValid(id);
      if(!validOrder.exists)
      {
        throw new Error('Order not found');
      }
      const priceRegEx = /^\d+$/;
      if(!priceRegEx.test(orderData.total_price)) {
          throw new Error('Price Is not valid');
      }
      await orderRepository.editOrder(id, orderData);
      return { message: 'Order updated successfully' };
    } catch (error) {
      console.error(error);
      throw new Error(`Error updating order: ${error.message}`);
    }
  }

  const deleteOrder = async function(id) {
    try {
      const validOrder = await orderRepository.order_id_isValid(id);
      if(!validOrder.exists)
        {
          throw new Error('Order not found');
        }
      await orderRepository.deleteOrder(id);
      return { message: 'Order deleted successfully' };
    } catch (error) {
      console.error(error);
      throw new Error(`Error deleting order: ${error.message}`);
    }
  }

  return { addOrder, editOrder, deleteOrder };
}

module.exports = { orderService };
