// const db=require('../db');
const generate = require("../securities/generators");
const { fixNumber } = require("../utils/numberFix");
const sql = require("../sql/sqlLoader");
function userRepo(db) {
  const searchByEmail = async function (email) {
    console.log(sql.users.searchByEmail);
    return db.oneOrNone(sql.users.searchByEmail, [email]);
  };
  const getUserById = async function (id) {
    return db.oneOrNone(sql.users.getById, [id]);
  };
  const addUser = async function (user) {
    console.log(sql.users.add);
    return db.none(sql.users.add, [
      user.id,
      user.name,
      user.email,
      user.password,
      user.role_id,
      fixNumber(user.phone),
    ]);
  };
  const updateUserAvatar = async function (id, avatar) {
    return db.none(sql.users.updateUserAvatar, [avatar, id]);
  };
  const editUser = async function (id, userData) {
    const fields = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone ? fixNumber(userData.phone) : undefined,
    };

    let i = 1;
    let setClauses = [];
    let values = [];

    for (const [column, value] of Object.entries(fields)) {
      if (value !== undefined && value !== null) {
        if (column === "password") {
          // hash password before adding
          const hashed = await generate.hashPassword(value);
          setClauses.push(`${column}=$${i}`);
          values.push(hashed);
        } else {
          setClauses.push(`${column}=$${i}`);
          values.push(value);
        }
        i++;
      }
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
