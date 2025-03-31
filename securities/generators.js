const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;


const hashPassword = async (plainPassword) => {
  try {
    const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);
    return hashedPassword;
  } catch (error) {
    throw new Error('Error hashing password',error);
  }
};
const { v4: uuid } = require('uuid');

const generateId = function() {
    const id = uuid();
    return id;
};
const generateName= function() {
  const date= new Date();
  //generate a name in the format of YYYY-MM-DD-HH:mm:ss-random number
  const name = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}-${Math.floor(Math.random()*1000)}`;
  return name;
};
module.exports = {
    hashPassword,
    generateId,
    generateName
}