const sql = require("../sql/sqlLoader");
function menuRepository(db) {
  const addMenu = async function (menu) {
    return await db.none(sql.menus.add, [
      menu.id,
      menu.cafe_id,
      menu.name,
      menu.price,
      menu.category,
      menu.description,
    ]);
  };

  const editMenu = async function (id, menu) {
    const fields = {
      cafe_id: menu.cafe_id,
      name: menu.name,
      price: menu.price,
      category: menu.category,
      description: menu.description,
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

    const query = `UPDATE menu SET ${setClauses.join(", ")} WHERE id=$${i}`;
    values.push(id);

    return await db.none(query, values);
  };

  const deleteMenu = async function (id) {
    return await db.none(sql.menus.delete, [id]);
  };

  // Search menu items by name and category for a specific cafe
  const searchMenus = async function (query, cafeId, limit, offset) {
    const menus = await db.any(sql.menus.search, [
      `%${query}%`,
      limit,
      offset,
      cafeId,
    ]);
    const totalCount = await db.one(sql.menus.searchCount, [
      `%${query}%`,
      cafeId,
    ]);
    return { menus, totalCount };
  };

  const listMenus = async function (cafeId, limit, offset) {
    const menus = await db.any(sql.menus.list, [limit, offset, cafeId]);
    const totalCount = await db.one(sql.menus.listCount, [cafeId]);
    return { menus, totalCount };
  };
  //in cafe sql
  const cafeId_isValid = async function (cafeId) {
    return await db.one(sql.cafes.cafeIdValidator, [cafeId]);
  };
  //in menu
  const menu_id_isValid = async function (menuId) {
    return await db.one(sql.menus.menuIdValidator, [menuId]);
  };
  return {
    addMenu,
    editMenu,
    deleteMenu,
    searchMenus,
    listMenus,
    menu_id_isValid,
    cafeId_isValid,
  };
}

module.exports = { menuRepository };
