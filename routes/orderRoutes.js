const express = require('express');

function orderRoutes(orderController) {
  const router = express.Router();
  router.post('/add', orderController.addOrder);
  router.put('/edit/:id', orderController.editOrder);
  router.delete('/delete/:id', orderController.deleteOrder);
  return router;
}

module.exports = orderRoutes;
