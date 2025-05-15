const generate = require("../securities/generators");
const reservationStatus = require("../enums/reserveStatus");
function reserveService(reserveRepository) {
  const addReservation = async function (reservationData) {
    if (
      !reservationData.cafe_id ||
      !reservationData.users_id ||
      !reservationData.tables_id ||
      !reservationData.reserve_time_id ||
      !reservationData.reserve_date_id ||
      !reservationData.status
    ) {
      throw new Error("All fields are required (except orders_id)");
    }
    // Validate foreign keys
    const validCafe = await reserveRepository.cafe_id_isValid(
      reservationData.cafe_id
    );
    const validUser = await reserveRepository.users_id_isValid(
      reservationData.users_id
    );
    const validTable = await reserveRepository.tables_id_isValid(
      reservationData.tables_id
    );
    const validTime = await reserveRepository.time_id_isValid(
      reservationData.reserve_time_id
    );
    const validDate = await reserveRepository.date_id_isValid(
      reservationData.reserve_date_id
    );
    if (!validCafe.exists) {
      throw new Error("Invalid cafe_id");
    }
    if (!validUser.exists) {
      throw new Error("Invalid users_id");
    }
    if (!validTable.exists) {
      throw new Error("Invalid tables_id");
    }
    if (!validTime.exists) {
      throw new Error("Invalid reserve_time_id");
    }
    if (!validDate.exists) {
      throw new Error("Invalid reserve_date_id");
    }
    //status validation
    if (!Object.values(reservationStatus).includes(reservationData.status)) {
      throw new Error("Invalid Status");
    }

    // //YYYY-MM-DD HH:MM:SS
    // const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    // if (!dateRegex.test(reservationData.reserve_time)) {
    //   throw new Error("Invalid reserve_time format");
    // }

    //if order has been made before
    let orders_id;
    if (reservationData.orders_id) {
      const validOrder = await reserveRepository.orders_id_isValid(
        reservationData.orders_id
      );
      if (!validOrder.exists) {
        throw new Error("Invalid orders_id");
      }
      orders_id = reservationData.orders_id;
    } else {
      orders_id = generate.generateId();
      await reserveRepository.addNullOrder(orders_id);
      console.log(reservationData.orders_id);
    }
    reservationData.orders_id = orders_id;
    const newReserve = {
      id: generate.generateId(),
      cafe_id: reservationData.cafe_id,
      users_id: reservationData.users_id,
      tables_id: reservationData.tables_id,
      reserve_time_id: reservationData.reserve_time_id,
      reserve_date_id: reservationData.reserve_date_id,
      status: reservationData.status,
      orders_id: reservationData.orders_id,
    };
    await reserveRepository.addReservation(newReserve);
    return { message: "Reservation added successfully" };
  };
  const editReserve = async function (id, reservationData) {
    const validReservation = await reserveRepository.reservation_id_isValid(id);
    if (!validReservation.exists) {
      throw new Error("Reservation not found");
    }
    // Optional: validate foreign keys if provided for update
    if (reservationData.cafe_id) {
      const validCafe = await reserveRepository.cafe_id_isValid(
        reservationData.cafe_id
      );
      if (!validCafe.exists) {
        throw new Error("Invalid cafe_id");
      }
    }
    if (reservationData.users_id) {
      const validUser = await reserveRepository.users_id_isValid(
        reservationData.users_id
      );
      if (!validUser.exists) {
        throw new Error("Invalid users_id");
      }
    }
    if (reservationData.tables_id) {
      const validTable = await reserveRepository.tables_id_isValid(
        reservationData.tables_id
      );
      if (!validTable.exists) {
        throw new Error("Invalid tables_id");
      }
    }
    if (reservationData.orders_id) {
      const validOrder = await reserveRepository.orders_id_isValid(
        reservationData.orders_id
      );
      if (!validOrder.exists) {
        throw new Error("Invalid orders_id");
      }
    }
    if (reservationData.reserve_date_id) {
      const validDate = await reserveRepository.date_id_isValid(
        reservationData.reserve_date_id
      );
      if (!validDate.exists) {
        throw new Error("Invalid reserve_date_id");
      }
    }
    if (reservationData.reserve_time_id) {
      const validTime = await reserveRepository.time_id_isValid(
        reservationData.reserve_time_id
      );
      if (!validTime.exists) {
        throw new Error("Invalid reserve_time_id");
      }
    }
    await reserveRepository.editReserve(id, reservationData);
    return { message: "Reservation updated successfully" };
  };
  const deleteReserve = async function (id) {
    const validReservation = await reserveRepository.reservation_id_isValid(id);
    if (!validReservation.exists) {
      throw new Error("Reservation not found");
    }
    await reserveRepository.deleteReserve(id);
    return { message: "Reservation deleted successfully" };
  };
  const searchReservation = async function (query, page, limit) {
    const offset = (page - 1) * limit;
    const result = await reserveRepository.searchReservations(
      query,
      limit,
      offset
    );
    if (result.length === 0) {
      throw new Error("No reservations found");
    }
    const totalCount = parseInt(result.reserves[0].total_count);
    const cleanedReserves = result.reserves.map((reserve) => {
      delete reserve.total_count;
      return reserve;
    });
    return { reserves: cleanedReserves, totalCount };
  };
  //lists for a cafe,table,user,order,reserve
  //users_id, cafe_id, tables_id, orders_id,id(reservation.id)
  const listReservations = async function (key, id, page, limit) {
    if (
      key !== "users_id" &&
      key !== "cafe_id" &&
      key !== "tables_id" &&
      key !== "orders_id" &&
      key !== "id"
    ) {
      throw new Error("Invalid key");
    }
    const offset = (page - 1) * limit;
    const result = await reserveRepository.listReservations(
      key,
      id,
      limit,
      offset
    );
    if (result.length === 0) {
      throw new Error("No reservations found");
    }
    const totalCount = parseInt(result.reserves[0].total_count);
    const cleanedReserves = result.reserves.map((reserve) => {
      delete reserve.total_count;
      return reserve;
    });
    return { reserves: cleanedReserves, totalCount };
  };
  return {
    addReservation,
    editReserve,
    searchReservation,
    deleteReserve,
    listReservations,
  };
}
module.exports = { reserveService };
