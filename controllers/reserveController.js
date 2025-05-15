const asyncHandler = require("../middleware/asyncHandler");
function reserveController(reserveService) {
  const addReservation = asyncHandler(async function (req, res) {
    let { cafe_id, users_id, tables_id, orders_id, reserve_time, status } =
      req.body;
    const reservationData = {
      cafe_id,
      users_id,
      tables_id,
      orders_id,
      reserve_time,
      status,
    };
    const result = await reserveService.addReservation(reservationData);
    return res.status(201).json({ result });
  });

  const editReservation = asyncHandler(async function (req, res) {
    const id = req.params.id;
    const { cafe_id, users_id, tables_id, orders_id, reserve_time, status } =
      req.body;
    const reservationData = {
      cafe_id,
      users_id,
      tables_id,
      orders_id,
      reserve_time,
      status,
    };
    const result = await reserveService.editReservation(id, reservationData);
    return res.status(200).json({ message: result });
  });
  const deleteReservation = asyncHandler(async function (req, res) {
    const id = req.params.id;
    const result = await reserveService.deleteReservation(id);
    return res.status(200).json({ message: result });
  });

  const searchReservations = asyncHandler(async function (req, res) {
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
      totalPages: Math.ceil(result.totalCount / limit),
      data: result.reservations,
    });
  });

  const listReservationsByFK = asyncHandler(async function (req, res) {
    //users_id, cafe_id, tables_id, orders_id
    const filterKey = req.query.filterKey;
    const id = req.params.id;
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    if (!page || !limit) {
      page = 1;
      limit = 10;
    }
    const result = await reserveService.listReservations(
      filterKey,
      id,
      page,
      limit
    );
    return res.status(200).json({
      page: page,
      limit: limit,
      totalCount: result.totalCount,
      totalPages: Math.ceil(result.totalCount / limit),
      data: result.reservations,
    });
  });
  return {
    addReservation,
    editReservation,
    deleteReservation,
    searchReservations,
    listReservationsByFK,
  };
}
module.exports = { reserveController };
