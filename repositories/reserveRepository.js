function reserveRepository(db) {
    const addReservation = async function(reservation) {
        return await db.none('INSERT INTO reservation (id, users_id, cafe_id, tables_id, orders_id, reserve_time, status) VALUES ($1, $2, $3, $4, $5, $6, $7)', [reservation.id, reservation.user_id, reservation.cafe_id, reservation.tables_id, reservation.orders_id, reservation.reserve_time, reservation.status]);
    }
    const editReservation = async function(id, reservation) {
        let i=2;
        let valuesQ=[];
        valuesQ[0]=id;
        let query='UPDATE reservation SET id=$1'
        if(reservation.tables_id)
            {
            let tableQ=`,tables_id=$${i}`;
            valuesQ[i-1]=reservation.table_id;
            i++;
            query=query+tableQ;
            }
        if(reservation.cafe_id)
            {
            let cafeIdQ=`,cafe_id=$${i}`;
            valuesQ[i-1]=reservation.cafe_id;
            i++;
            query=query+cafeIdQ;
            }
        if(reservation.users_id)
            {
            let userQ=`,users_id=$${i}`;
            valuesQ[i-1]=reservation.users_id;
            i++;
            query=query+userQ;
            }
        if(reservation.orders_id)
            {
            let orderQ=`,orders_id=$${i}`;
            valuesQ[i-1]=reservation.orders_id;
            i++;
            query=query+orderQ;
            }
        if(reservation.reserve_time)
            {
            let reserveQ=`,reserve_time=$${i}`;
            valuesQ[i-1]=reservation.reserve_time;
            i++;
            query=query+reserveQ;
            }
        if(reservation.status)
            {
            let statusQ=`,status=$${i}`;
            valuesQ[i-1]=reservation.status;
            i++;
            query=query+statusQ;
            }

        
        query=query+` WHERE id=$1`;
        return await db.none(query,valuesQ);
    }
    const deleteReservation = async function(id) {
        return await db.none('DELETE FROM reservation WHERE id=$1', [id]);
    };
//searchs for reservations by username, user phone, cafe name, or cafe phone
    const searchReservations = async function(query, limit, offset) {
       const reserves=await db.any('SELECT reservation.*, users.name AS user_name, cafe.name AS cafe_name, users.phone AS user_phone, cafe.contact_number AS cafe_phone, COUNT(*) OVER() AS total_count FROM reservation JOIN users ON reservation.users_id=users.id JOIN cafe ON reservation.cafe_id=cafe.id WHERE users.name ILIKE $1 OR users.phone ILIKE $1 OR cafe.name ILIKE $1 OR cafe.contact_number ILIKE $1 LIMIT $2 OFFSET $3 ',[`%${query}%`, limit, offset]);
     //getting total count from reserses instead of another query
     return {reserves};
    }
    //list reserves for a specific cafe or user or table or order or shows info of a reserve by id
    const listReservations = async function(key,id,limit, offset) {
        const reserves = await db.any(`SELECT reservation.*, users.name AS users_name, cafe.name AS cafe_name, tables.table_no AS tables_no, orders.items AS orders_items, orders.total_price AS total_price, COUNT(*) OVER() AS total_count FROM reservation JOIN users ON reservation.users_id=users.id JOIN cafe ON reservation.cafe_id=cafe.id JOIN tables ON reservation.tables_id=tables.id JOIN orders ON reservation.orders_id=orders.id WHERE reservation.${key}=$1 LIMIT $2 OFFSET $3`, [id, limit, offset]);
        return {reserves};
    }
    const reservation_id_isValid = async function(id) {
        return await db.one('SELECT EXISTS(SELECT 1 FROM reservation WHERE id=$1)', [id]);
    }
    const cafe_id_isValid = async function(id) {
        return await db.one('SELECT EXISTS(SELECT 1 FROM cafe WHERE id=$1)', [id]);
    }
    const users_id_isValid = async function(id) {
        return await db.one('SELECT EXISTS(SELECT 1 FROM users WHERE id=$1)', [id]);
    }
    const tables_id_isValid = async function(id) {
        return await db.one('SELECT EXISTS(SELECT 1 FROM tables WHERE id=$1)', [id]);
    }
    const orders_id_isValid = async function(id) {
        return await db.one('SELECT EXISTS(SELECT 1 FROM orders WHERE id=$1)', [id]);
    }
    const addNullOrder = async function(id) {
        return await db.none(
          'INSERT INTO orders (id) VALUES ($1)',
          [id]
        );
      }
    return {addReservation, editReservation, deleteReservation, searchReservations, listReservations, cafe_id_isValid, users_id_isValid, tables_id_isValid, orders_id_isValid, reservation_id_isValid, addNullOrder  };
}

module.exports={reserveRepository};