function reserveController(reserveService)
{
    const addReservation = async function(req, res) {
        try {
          let { cafe_id, users_id, tables_id, orders_id, reserve_time, status } = req.body;
          const reservationData = { cafe_id, users_id, tables_id, orders_id, reserve_time, status };
          const result = await reserveService.addReservation(reservationData);
          return res.status(201).json({ result });
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
       
    }
    const editReservation = async function(req, res) {
        try {
          const id = req.params.id;
          const { cafe_id, users_id, tables_id, orders_id, reserve_time, status } = req.body;
          const reservationData = { cafe_id, users_id, tables_id, orders_id, reserve_time, status };
          const result = await reserveService.editReservation(id, reservationData);
          return res.status(200).json({ message: result });
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
    }
    const deleteReservation = async function(req, res) {
        try {
          const id = req.params.id;
          const result = await reserveService.deleteReservation(id);
          return res.status(200).json({ message: result });
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
    }
    const searchReservations = async function(req, res) {
        try {
          const query = req.query.q;
          let page = parseInt(req.query.page);
          let limit = parseInt(req.query.limit);
          if (!page || !limit) {
            page = 1;
            limit = 10;
          }
          const result = await reserveService.searchReservations(query, page, limit);
          return res.status(200).json({
            page: page,
            limit: limit,
            totalCount: result.totalCount,
            totalPages: Math.ceil(result.totalCount/ limit),
            data: result.reservations,
          });
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
    } 
    const listReservationsByFK = async function(req, res) {
        try {
            //users_id, cafe_id, tables_id, orders_id
          const filterKey = req.params.filterKey; 
          const id = req.params.id;
          let page = parseInt(req.query.page);
          let limit = parseInt(req.query.limit);
          if (!page || !limit) {
            page = 1;
            limit = 10;
          }
          const result = await reserveService.listReservations(filterKey, id, page, limit);
          return res.status(200).json({
            page: page,
            limit: limit,
            totalCount: result.totalCount,
            totalPages: Math.ceil(result.totalCount / limit),
            data: result.reservations,
          });
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
    }
    return{addReservation, editReservation, deleteReservation, searchReservations, listReservationsByFK};
}
module.exports={reserveController};