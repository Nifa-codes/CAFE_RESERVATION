// const db=require('../db');
const generate=require('../securities/generators');
function userRepo(db) {
const searchByEmail=async function(email)
{
  return db.oneOrNone('SELECT * FROM users WHERE LOWER(email)=LOWER($1)',[email]);
}
const getUserById=async function(id)
{
  return db.oneOrNone('SELECT 1 FROM users WHERE id=$1',[id]);
}
const addUser=async function(user)
{
  let phone=user.phone.slice(1);
  phone=`098${phone}`;
  return db.none('INSERT INTO users (id, name, email, password, role_id, phone) VALUES ($1, $2, $3, $4, $5, $6)', [user.id, user.name, user.email, user.password, user.role_id, phone]);
}
const updateUserAvatar=async function(id,avatar)
{
  return db.none('UPDATE users SET avatar_url = $1 WHERE id = $2',[avatar,id]);
}
const editUser=async function(id,userData)
{ //my algorithm for dynamic update
  let i=2;
  let valuesQ=[];
  valuesQ[0]=id;
  let query='UPDATE users SET id=$1'
  if(userData.name)
    {
      let nameQ=`,name=$${i}`;
      valuesQ[i-1]=userData.name;
      i++;
      query=query+nameQ;
    }
  if(userData.email)
    {
      let emailQ=`,email=$${i}`;
      valuesQ[i-1]=userData.email;
      i++;
      query=query+emailQ;
    }
  if(userData.password)
    {
      let passwordQ=`,password=$${i}`;
      valuesQ[i-1]=await generate.hashPassword(userData.password);
      i++;
      query=query+passwordQ;
    }
  if(userData.phone)
    {
      let phoneQ=`,phone=$${i}`;
      let phone=userData.phone.slice(1);
      phone=`098${phone}`;
      valuesQ[i-1]=phone;
      i++;
      query=query+phoneQ;
    }
  
  query=query+` WHERE id=$1`;
  return db.none(query,valuesQ);
}
const deleteUser = async function(id)
{
  db.none('DELETE FROM users WHERE id=$1', [id]);
}
const searchUser = async function(query,limit,offset)
{
 console.log('query:', query);
  let totalCount=await db.one('SELECT COUNT(*) FROM users WHERE LOWER (name) LIKE LOWER ($1) OR LOWER (email) LIKE LOWER ($1)',[`%${query}%`]);
  let users=await db.any('SELECT * FROM users WHERE LOWER (name) LIKE LOWER ($1) OR LOWER (email) LIKE LOWER ($1) LIMIT $2 OFFSET $3',[`%${query}%`,limit,offset]);
  return {users,totalCount};
}
const getAllUsers = async function(limit,offset)
{
  const users= await db.any('SELECT * FROM users LIMIT $1 OFFSET $2', [limit, offset]);
  const totalCount= await db.one('SELECT COUNT(*) FROM users');
  return {users,totalCount};
}
return{
    searchByEmail,
    addUser,
    updateUserAvatar,
    getUserById,
    editUser,
    deleteUser,
    searchUser,
    getAllUsers
 };
}
module.exports={
   userRepo
};