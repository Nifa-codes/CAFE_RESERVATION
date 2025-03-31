const express = require('express');

function reserveRoutes(reservationController) {
  const router = express.Router();
  router.post('/add', reservationController.addReservation);
  router.put('/edit/:id', reservationController.editReservation);
  router.delete('/delete/:id', reservationController.deleteReservation);
  router.get('/search', reservationController.searchReservations);
  // /filter/:filterKey/:id
  router.get('/filter/:filterKey/:id', reservationController.listReservationsByFK);
  return router;
}

module.exports = reserveRoutes;