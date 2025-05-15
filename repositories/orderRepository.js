const sql = require("../sql/sqlLoader");
function orderRepository(db) {
  const addOrder = async function (order) {
    return await db.none(sql.orders.add, [
      order.id,
      order.items,
      order.status,
      order.total_price,
    ]);
  };

  const editOrder = async function (id, order) {
    const fields = {
      items: order.items,
      status: order.status,
      total_price: order.total_price,
    };

    let i = 1;
    let setClauses = [];
    let values = [];

    for (const [column, value] of Object.entries(fields)) {
      if (value !== undefined && value !== null) {
        setClauses.push(`${column}=$${i}`);
        values.push(value);
        i++;
      }
    }

    if (setClauses.length === 0) {
      throw new Error("No fields to update");
    }

    const query = `UPDATE orders SET ${setClauses.join(", ")} WHERE id=$${i}`;
    values.push(id);

    return await db.none(query, values);
  };

  const deleteOrder = async function (id) {
    return await db.none(sql.orders.delete, [id]);
  };
  const order_id_isValid = async function (id) {
    return await db.one(sql.orders.orderIdValidator, [id]);
  };
  return { addOrder, editOrder, deleteOrder, order_id_isValid };
}

module.exports = { orderRepository };
