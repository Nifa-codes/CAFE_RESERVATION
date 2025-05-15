const { fixNumber } = require("../utils/numberFix");
const sql = require("../sql/sqlLoader");
function cafeRepository(db) {
  const searchCafeByNumber = async function (number) {
    return await db.oneOrNone(sql.cafes.searchByNumber, [fixNumber(number)]);
  };
  const addCafe = async function (cafe) {
    return await db.none(sql.cafes.add, [
      cafe.id,
      cafe.name,
      fixNumber(cafe.phone),
      cafe.address,
      cafe.oppeningHours,
    ]);
  };
  const editCafe = async function (id, cafe) {
    const fields = {
      name: cafe.name,
      address: cafe.address,
      opening_hours: cafe.openingHours,
      contact_number: cafe.phone ? fixNumber(cafe.phone) : undefined,
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

    const query = `UPDATE cafe SET ${setClauses.join(", ")} WHERE id=$${i}`;
    values.push(id);

    return await db.none(query, values);
  };
  const deleteCafe = async function (id) {
    return await db.none(sql.cafes.delete, [id]);
  };
  const searchCafes = async function (query, limit, offset) {
    const cafes = await db.any(sql.cafes.search, [`%${query}%`, limit, offset]);
    const totalCount = await db.one(sql.cafes.searchCount, [`%${query}%`]);
    return { cafes, totalCount };
  };
  const listCafes = async function (limit, offset) {
    const cafes = await db.any(sql.cafes.list, [limit, offset]);
    const totalCount = await db.one(sql.cafes.listCount);
    return { cafes, totalCount };
  };
  const getCafeById = async function (id) {
    return await db.oneOrNone(sql.cafes.getById, [id]);
  };
  return {
    searchCafeByNumber,
    addCafe,
    editCafe,
    deleteCafe,
    searchCafes,
    listCafes,
    getCafeById,
  };
}
module.exports = { cafeRepository };
