const generate=require('./securities/generators');
function reserveService(reserveRepository) {
    const addReservation = async function(reservationData) {
        try {
            if (!reservationData.cafe_id || !reservationData.users_id || !reservationData.tables_id || !reservationData.reserve_time || !reservationData.status) {
                throw new Error('All fields are required (except orders_id)');
            }
            // Validate foreign keys
            const validCafe = await reserveRepository.cafe_id_isValid(reservationData.cafe_id);
            const validUser = await reserveRepository.users_id_isValid(reservationData.users_id);
            const validTable = await reserveRepository.tables_id_isValid(reservationData.tables_id);            
            if (!validCafe.exists) {
                throw new Error('Invalid cafe_id');
            }
            if (!validUser.exists) {
                throw new Error('Invalid users_id');
            }
            if (!validTable.exists) {
                throw new Error('Invalid tables_id');
            }

            //YYYY-MM-DD HH:MM:SS
            const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
            if(!dateRegex.test(reservationData.reserve_time))
            {
                throw new Error('Invalid reserve_time format');
            }
            //if order has been made before
            let orders_id;
            if(reservationData.orders_id)
            {
                const validOrder = await reserveRepository.orders_id_isValid(reservationData.orders_id);
                if (!validOrder.exists) {
                    throw new Error('Invalid orders_id');
                }
                orders_id=reservationData.orders_id;
            }
            else
            {
                orders_id=generate.generateId();
                await reserveRepository.addNullOrder(orders_id);
                console.log(reservationData.orders_id)
            }
            reservationData.orders_id=orders_id;
            const newReserve={
                id: generate.generateId(),
                cafe_id: reservationData.cafe_id,
                users_id: reservationData.users_id,
                tables_id: reservationData.tables_id,
                reserve_time: reservationData.reserve_time,
                status: reservationData.status,
                orders_id: reservationData.orders_id
            }
            await reserveRepository.addReservation(newReserve);
            return { message: 'Reservation added successfully' };
        } catch (error) {
            throw new Error(`Error adding reservation: ${error.message}`);
        }
    }
    const editReserve = async function(id, reservationData) {
        try{
            const validReservation = await reserveRepository.reservation_id_isValid(id);
            if (!validReservation.exists) {
              throw new Error('Reservation not found');
            }
            // Optional: validate foreign keys if provided for update
            if (reservationData.cafe_id) {
              const validCafe = await reserveRepository.cafe_id_isValid(reservationData.cafe_id);
              if (!validCafe.exists) {
                throw new Error('Invalid cafe_id');
              }
            }
            if (reservationData.users_id) {
              const validUser = await reserveRepository.users_id_isValid(reservationData.users_id);
              if (!validUser.exists) {
                throw new Error('Invalid users_id');
              }
            }
            if (reservationData.tables_id) {
              const validTable = await reserveRepository.tables_id_isValid(reservationData.tables_id);
              if (!validTable.exists) {
                throw new Error('Invalid tables_id');
              }
            }
            if (reservationData.orders_id) {
              const validOrder = await reserveRepository.orders_id_isValid(reservationData.orders_id);
              if (!validOrder.exists) {
                throw new Error('Invalid orders_id');
              }
            }
            await reserveRepository.editReserve(id,reservationData);
            return { message: 'Reservation updated successfully' };
        }catch(err)
        {
            throw new Error(`Error editing reservation: ${err.message}`);
        }
    }
    const deleteReserve = async function(id) {
        try{
            const validReservation = await reserveRepository.reservation_id_isValid(id);
            if (!validReservation.exists) {
              throw new Error('Reservation not found');
            }
            await reserveRepository.deleteReserve(id);
            return { message: 'Reservation deleted successfully' };
        }catch(err)
        {
            throw new Error(`Error deleting reservation: ${err.message}`);
        }
    }
    const searchReservation= async function (query, page, limit)
    {
        try
        {
            const offset=(page-1)*limit;
            const result = await reserveRepository.searchReservations(query, limit, offset);
            if(result.length===0)
            {
                throw new Error('No reservations found');
            }
            const totalCount= parseInt(result.reserves[0].total_count)
            const cleanedReserves= result.reserves.map(reserve=>
            {
                delete reserve.total_count;
                return reserve;
            }
            );
            return{reserves:cleanedReserves, totalCount};
        }catch(err)
        {
            throw new Error(`Error searching reservations: ${err.message}`);
        }
    }
    //lists for a cafe,table,user,order,reserve
    //users_id, cafe_id, tables_id, orders_id,id(reservation.id)
    const listReservations = async function(key,id,page, limit) {
        try
        {
            if(key!=='users_id'&&key!=='cafe_id'&&key!=='tables_id'&&!key=='orders_id'&&key!=='id')
            {
                throw new Error('Invalid key');
            }
            const offset=(page-1)*limit;
            const result = await reserveRepository.listReservations(key,id,limit, offset);
            if(result.length===0)
            {
                throw new Error('No reservations found');
            }
            const totalCount= parseInt(result.reserves[0].total_count)
            const cleanedReserves= result.reserves.map(reserve=>
            {
                delete reserve.total_count;
                return reserve;
            }
            );
            return{reserves:cleanedReserves, totalCount};
        }catch(err)
        {
            throw new Error(`Error listing reservations: ${err.message}`);
        }
    }
    return { addReservation, editReserve, searchReservation, deleteReserve, listReservations };
}
module.exports = {reserveService};