function orderRepository(db) {
    const addOrder = async function(order) {
      return await db.none(
        'INSERT INTO orders (id, items, status, total_price) VALUES ($1, $2, $3, $4)',
        [order.id, order.items, order.status, order.total_price]
      );
    }
  
    const editOrder = async function(id, order) {
      let i = 2;
      let valuesQ = [];
      valuesQ[0] = id;
      let query = 'UPDATE orders SET id=$1';
      if (order.items) {
        let itemsQ = `,items=$${i}`;
        valuesQ[i - 1] = order.items;
        i++;
        query = query + itemsQ;
      }
      if (order.status) {
        let statusQ = `,status=$${i}`;
        valuesQ[i - 1] = order.status;
        i++;
        query = query + statusQ;
      }
      if (order.total_price) {
        let priceQ = `,total_price=$${i}`;
        valuesQ[i - 1] = order.total_price;
        i++;
        query = query + priceQ;
      }
      query = query + ' WHERE id=$1';
      return await db.none(query, valuesQ);
    }
  
    const deleteOrder = async function(id) {
      return await db.none('DELETE FROM orders WHERE id=$1', [id]);
    }
    const order_id_isValid = async function(id) {
        return await db.one('SELECT EXISTS(SELECT * FROM orders WHERE id=$1)', [id]);
    }
    return { addOrder, editOrder, deleteOrder, order_id_isValid };
  }
  
  module.exports = { orderRepository };
  