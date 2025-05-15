const generate = require("../securities/generators");

function orderService(orderRepository) {
  const addOrder = async function (orderData) {
    const priceRegEx = /^\d+$/;
    if (!priceRegEx.test(orderData.total_price)) {
      throw new Error("Price Is not valid");
    }
    if (!orderData.items || !orderData.status || !orderData.total_price) {
      throw new Error("Items, Status, and Total Price are required");
    }
    const newOrder = {
      id: generate.generateId(),
      items: orderData.items,
      status: orderData.status,
      total_price: orderData.total_price,
    };
    await orderRepository.addOrder(newOrder);
    return { message: "Order added successfully" };
  };

  const editOrder = async function (id, orderData) {
    const validOrder = await orderRepository.order_id_isValid(id);
    if (!validOrder.exists) {
      throw new Error("Order not found");
    }
    const priceRegEx = /^\d+$/;
    if (!priceRegEx.test(orderData.total_price)) {
      throw new Error("Price Is not valid");
    }
    await orderRepository.editOrder(id, orderData);
    return { message: "Order updated successfully" };
  };

  const deleteOrder = async function (id) {
    const validOrder = await orderRepository.order_id_isValid(id);
    if (!validOrder.exists) {
      throw new Error("Order not found");
    }
    await orderRepository.deleteOrder(id);
    return { message: "Order deleted successfully" };
  };

  return { addOrder, editOrder, deleteOrder };
}

module.exports = { orderService };
