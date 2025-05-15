const sql = require("../sql/sqlLoader");
function reserveRepository(db) {
  const addReservation = async function (reservation) {
    return await db.none(sql.reserves.add, [
      reservation.id,
      reservation.user_id,
      reservation.cafe_id,
      reservation.tables_id,
      reservation.orders_id,
      reservation.reserve_time_id,
      reservation.reserve_date_id,
      reservation.status,
    ]);
  };
  const editReservation = async function (id, reservation) {
    const fields = {
      tables_id: reservation.tables_id,
      cafe_id: reservation.cafe_id,
      users_id: reservation.users_id,
      orders_id: reservation.orders_id,
      reserve_time_id: reservation.reserve_time_id,
      reserve_date_id: reservation.reserve_date_id,
      status: reservation.status,
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

    const query = `UPDATE reservation SET ${setClauses.join(
      ", "
    )} WHERE id=$${i}`;
    values.push(id);

    return await db.none(query, values);
  };
  const deleteReservation = async function (id) {
    return await db.none(sql.reserves.delete, [id]);
  };
  //searchs for reservations by username, user phone, cafe name, or cafe phone
  const searchReservations = async function (query, limit, offset) {
    const reserves = await db.any(sql.reserves.search, [
      `%${query}%`,
      limit,
      offset,
    ]);
    //getting total count from reserses instead of another query
    return { reserves };
  };
  //list reserves for a specific cafe or user or table or order or shows info of a reserve by id
  const listReservations = async function (key, id, limit, offset) {
    const reserves = await db.any(
      `SELECT reservation.*, users.name AS users_name, cafe.name AS cafe_name, tables.table_no AS tables_no, orders.items AS orders_items, orders.total_price AS total_price, COUNT(*) OVER() AS total_count FROM reservation JOIN users ON reservation.users_id=users.id JOIN cafe ON reservation.cafe_id=cafe.id JOIN tables ON reservation.tables_id=tables.id JOIN orders ON reservation.orders_id=orders.id WHERE reservation.${key}=$1 LIMIT $2 OFFSET $3`,
      [id, limit, offset]
    );
    return { reserves };
  };
  const reservation_id_isValid = async function (id) {
    return await db.one(sql.reserves.reserveIdValidator, [id]);
  };
  const cafe_id_isValid = async function (id) {
    return await db.one(sql.cafes.cafeIdValidator, [id]);
  };
  const users_id_isValid = async function (id) {
    return await db.one(sql.users.userIdValidator, [id]);
  };
  const tables_id_isValid = async function (id) {
    return await db.one(sql.tables.tableIdValidator, [id]);
  };
  const orders_id_isValid = async function (id) {
    return await db.one(sql.orders.orderIdValidator, [id]);
  };
  const addNullOrder = async function (id) {
    return await db.none(sql.reserves.addNullOrder, [id]);
  };
  const date_id_isValid = async function (id) {
    return await db.one(sql.reserves.dateIdValidator, [id]);
  };
  const time_id_isValid = async function (id) {
    return await db.one(sql.reserves.timeIdValidator, [id]);
  };
  return {
    addReservation,
    editReservation,
    deleteReservation,
    searchReservations,
    listReservations,
    cafe_id_isValid,
    users_id_isValid,
    tables_id_isValid,
    orders_id_isValid,
    reservation_id_isValid,
    addNullOrder,
    date_id_isValid,
    time_id_isValid,
  };
}

module.exports = { reserveRepository };
