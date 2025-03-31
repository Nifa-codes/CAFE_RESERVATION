function tableRepository(db) {
    const addTable = async function(table) {
        return await db.none('INSERT INTO tables (id, cafe_id, table_no, capacity, is_available) VALUES ($1, $2, $3, $4, $5)', [table.id, table.cafe_id, table.table_no, table.capacity, table.is_available]);
    }
    const editTable = async function(id, table) {
        let i=2;
        let valuesQ=[];
        valuesQ[0]=id;
        let query='UPDATE tables SET id=$1'
        if(table.table_no)
            {
            let tableQ=`,table_no=$${i}`;
            valuesQ[i-1]=table.table_no;
            i++;
            query=query+tableQ;
            }
        if(table.cafe_id)
            {
            let cafeIdQ=`,cafe_id=$${i}`;
            valuesQ[i-1]=table.cafe_id;
            i++;
            query=query+cafeIdQ;
            }
        if(table.capacity)
            {
            let capacityQ=`,capacity=$${i}`;
            valuesQ[i-1]=table.capacity;
            i++;
            query=query+capacityQ;
            }
        if(table.is_available)
            {
            let availableQ=`,is_available=$${i}`;
            valuesQ[i-1]=table.is_available;
            i++;
            query=query+availableQ;
            }
        
        query=query+` WHERE id=$1`;
        return await db.none(query,valuesQ);
    }
    const deleteTable = async function(id) {
        return await db.none('DELETE FROM tables WHERE id=$1', [id]);
    }
    const searchTables = async function(cafe_id,query, limit, offset) {
        const tables = await db.any('SELECT tables.*, cafe.name AS cafename FROM tables JOIN cafe ON tables.cafe_id=cafe.id WHERE cafe_id=$1 AND (tables.table_no = $2) LIMIT $3 OFFSET $4', [cafe_id, query, limit, offset]);
        
        const totalCount = await db.one('SELECT COUNT(*) FROM tables WHERE cafe_id=$1 AND (tables.table_no = $2)', [cafe_id, query]);
        return { tables, totalCount };
    } 
    const listTables = async function(cafe_id, limit, offset) {
        const tables = await db.any('SELECT tables.*, cafe.name AS cafename FROM tables JOIN cafe ON tables.cafe_id=cafe.id WHERE cafe_id=$1 LIMIT $2 OFFSET $3', [cafe_id, limit, offset]);
        const totalCount = await db.one('SELECT COUNT(*) FROM tables WHERE cafe_id=$1', [cafe_id]);
        return { tables, totalCount };
    }
    const cafe_id_isValid=async function(id) {
        return await db.one('SELECT EXISTS (SELECT 1 FROM cafe WHERE id=$1)', [id]);
    }
    const table_id_isValid=async function(id) {
        return await db.one('SELECT EXISTS (SELECT 1 FROM tables WHERE id=$1)', [id]);
    }
    return {
        addTable,
        editTable,
        deleteTable,
        searchTables,
        listTables,
        cafe_id_isValid,
        table_id_isValid,
    };
}
module.exports = { tableRepository };