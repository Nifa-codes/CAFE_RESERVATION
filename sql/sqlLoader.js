const { QueryFile } = require("pg-promise");
const path = require("path");
function sql(filePath) {
  const fullPath = path.join(__dirname, filePath);
  const query = new QueryFile(fullPath, { minify: true });
  return query;
}
module.exports = {
  cafes: {
    add: sql("cafes/add.sql"),
    cafeIdValidator: sql("cafes/cafeIdValidator.sql"),
    delete: sql("cafes/delete.sql"),
    getById: sql("cafes/getById.sql"),
    list: sql("cafes/list.sql"),
    listCount: sql("cafes/listCount.sql"),
    search: sql("cafes/search.sql"),
    searchCount: sql("cafes/searchCount.sql"),
    searchByNumber: sql("cafes/searchByNumber.sql"),
  },
  menus: {
    add: sql("menus/add.sql"),
    delete: sql("menus/delete.sql"),
    list: sql("menus/list.sql"),
    listCount: sql("menus/listCount.sql"),
    menuIdValidator: sql("menus/menuIdValidator.sql"),
    search: sql("menus/search.sql"),
    searchCount: sql("menus/searchCount.sql"),
  },
  orders: {
    add: sql("orders/add.sql"),
    delete: sql("orders/delete.sql"),
    orderIdValidator: sql("orders/orderIdValidator.sql"),
  },
  reserves: {
    add: sql("reserves/add.sql"),
    delete: sql("reserves/delete.sql"),
    list: sql("reserves/list.sql"),
    listCount: sql("reserves/listCount.sql"),
    reserveIdValidator: sql("reserves/reserveIdValidator.sql"),
    search: sql("reserves/search.sql"),
    searchCount: sql("reserves/searchCount.sql"),
    dateIdValidator: sql("reserves/dateIdValidator.sql"),
    timeIdValidator: sql("reserves/timeIdValidator.sql"),
  },
  tables: {
    add: sql("tables/add.sql"),
    delete: sql("tables/delete.sql"),
    list: sql("tables/list.sql"),
    listCount: sql("tables/listCount.sql"),
    tableIdValidator: sql("tables/tableIdValidator.sql"),
    search: sql("tables/search.sql"),
    searchCount: sql("tables/searchCount.sql"),
  },
  users: {
    add: sql("users/add.sql"),
    delete: sql("users/delete.sql"),
    list: sql("users/list.sql"),
    listCount: sql("users/listCount.sql"),
    userIdValidator: sql("users/userIdValidator.sql"),
    search: sql("users/search.sql"),
    searchCount: sql("users/searchCount.sql"),
    getById: sql("users/getById.sql"),
    searchByEmail: sql("users/searchByEmail.sql"),
    updateUserAvatar: sql("users/updateUserAvatar.sql"),
  },
};
