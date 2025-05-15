// const db=require('../db');
const generate = require("../securities/generators");
const { fixNumber } = require("../utils/numberFix");
const sql = require("../sql/sqlLoader");
function userRepo(db) {
  const searchByEmail = async function (email) {
    return db.oneOrNone("SELECT * FROM users WHERE LOWER(email)=LOWER($1)", [
      email,
    ]);
  };
  const getUserById = async function (id) {
    return db.oneOrNone("SELECT 1 FROM users WHERE id=$1", [id]);
  };
  const addUser = async function (user) {
    let phone = user.phone.slice(1);
    phone = `098${phone}`;
    return db.none(
      "INSERT INTO users (id, name, email, password, role_id, phone) VALUES ($1, $2, $3, $4, $5, $6)",
      [user.id, user.name, user.email, user.password, user.role_id, phone]
    );
  };
  const updateUserAvatar = async function (id, avatar) {
    return db.none("UPDATE users SET avatar_url = $1 WHERE id = $2", [
      avatar,
      id,
    ]);
  };
  const editUser = async function (id, userData) {
    //my algorithm for dynamic update
    let i = 2;
    let valuesQ = [];
    valuesQ[0] = id;
    let query = "UPDATE users SET id=$1";
    if (userData.name) {
      let nameQ = `,name=$${i}`;
      valuesQ[i - 1] = userData.name;
      i++;
      query = query + nameQ;
    }

    if (setClauses.length === 0) {
      throw new Error("No fields to update");
    }

    const query = `UPDATE users SET ${setClauses.join(", ")} WHERE id=$${i}`;
    values.push(id);

    return db.none(query, values);
  };
  const deleteUser = async function (id) {
    await db.none(sql.users.delete, [id]);
  };
  const searchUser = async function (query, limit, offset) {
    console.log("query:", query);
    let totalCount = await db.one(sql.users.searchCount, [`%${query}%`]);
    let users = await db.any(sql.users.search, [`%${query}%`, limit, offset]);
    return { users, totalCount };
  };
  const getAllUsers = async function (limit, offset) {
    const users = await db.any(sql.users.list, [limit, offset]);
    const totalCount = await db.one(sql.users.listCount);
    return { users, totalCount };
  };
  return {
    searchByEmail,
    addUser,
    updateUserAvatar,
    getUserById,
    editUser,
    deleteUser,
    searchUser,
    getAllUsers,
  };
}
module.exports = {
  userRepo,
};
