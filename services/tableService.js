const generate = require("../securities/generators");
function tableService(tableRepository) {
  const addTable = async function (tableData) {
    const numberRegex = /^\d+$/;
    if (
      !numberRegex.test(tableData.table_no) ||
      !numberRegex.test(tableData.capacity)
    ) {
      throw new Error("Table Number and Capacity must be valid numbers");
    }
    const validCafe = await tableRepository.cafe_id_isValid(tableData.cafe_id);
    if (!validCafe.exists) {
      throw new Error("Cafe ID does not exist");
    }
    if (!tableData.cafe_id) {
      throw new Error("Cafe ID is required");
    }
    const newTable = {
      id: generate.generateId(),
      cafe_id: tableData.cafe_id,
      table_no: tableData.table_no,
      capacity: tableData.capacity,
      is_available: tableData.is_available,
    };
    await tableRepository.addTable(newTable);
    return { message: "Table added successfully" };
  };
  const editTable = async function (id, tableData) {
    const table = await tableRepository.table_id_isValid(id);
    if (!table.exists) {
      throw new Error("Table not found");
    }
    await tableRepository.editTable(id, tableData);
    return { message: "Table updated successfully" };
  };
  const deleteTable = async function (id) {
    const table = await tableRepository.table_id_isValid(id);
    if (!table.exists) {
      throw new Error("Table not found");
    }
    await tableRepository.deleteTable(id);
    return { message: "Table deleted successfully" };
  };
  const searchTable = async function (cafe_id, query, page, limit) {
    const validCafe = await tableRepository.cafe_id_isValid(cafe_id);
    if (!validCafe.exists) {
      throw new Error("Cafe ID does not exist");
    }
    const offset = (page - 1) * limit;
    const result = await tableRepository.searchTables(
      cafe_id,
      query,
      limit,
      offset
    );

    if (result.tables.length === 0) {
      throw new Error("No tables found");
    }
    const cafeName = result.tables[0].cafename;
    const cleanedTables = result.tables.map((table) => {
      delete table.cafename;
      return table;
    });
    return {
      cafeName,
      tables: cleanedTables,
      totalCount: result.totalCount,
    };
  };
  const listTables = async function (cafe_id, page, limit) {
    const validCafe = await tableRepository.cafe_id_isValid(cafe_id);
    if (!validCafe.exists) {
      throw new Error("Cafe ID does not exist");
    }
    const offset = (page - 1) * limit;
    const result = await tableRepository.listTables(cafe_id, limit, offset);
    const cafeName = result.tables[0].cafename;
    const cleanedTables = result.tables.map((table) => {
      delete table.cafename;
      return table;
    });
    return {
      cafeName,
      tables: cleanedTables,
      totalCount: result.totalCount,
    };
  };
  return { addTable, editTable, deleteTable, searchTable, listTables };
}
module.exports = { tableService };
