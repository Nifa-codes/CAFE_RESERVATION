const sql = require("../sql/sqlLoader");
function tableRepository(db) {
  const addTable = async function (table) {
    return await db.none(sql.tables.add, [
      table.id,
      table.cafe_id,
      table.table_no,
      table.capacity,
      table.is_available,
    ]);
  };
  const editTable = async function (id, table) {
    const fields = {
      table_no: table.table_no,
      cafe_id: table.cafe_id,
      capacity: table.capacity,
      is_available: table.is_available,
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

    const query = `UPDATE tables SET ${setClauses.join(", ")} WHERE id=$${i}`;
    values.push(id);

    return await db.none(query, values);
  };
  const deleteTable = async function (id) {
    return await db.none(sql.tables.delete, [id]);
  };
  const searchTables = async function (cafe_id, query, limit, offset) {
    const tables = await db.any(sql.tables.search, [
      cafe_id,
      query,
      limit,
      offset,
    ]);

    const totalCount = await db.one(sql.tables.searchCount, [cafe_id, query]);
    return { tables, totalCount };
  };
  const listTables = async function (cafe_id, limit, offset) {
    const tables = await db.any(sql.tables.list, [cafe_id, limit, offset]);
    const totalCount = await db.one(sql.tables.listCount, [cafe_id]);
    return { tables, totalCount };
  };
  const cafe_id_isValid = async function (id) {
    return await db.one(sql.cafes.cafeIdValidator, [id]);
  };
  const table_id_isValid = async function (id) {
    return await db.one(sql.tables.tableIdValidator, [id]);
  };
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
