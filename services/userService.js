function userService(userRepository) {
  const generator = require("../securities/generators");

  const addUser = async function (userData) {
    //validate user data before saving to the database
    const emailRegex =
      /^[A-Za-z0-9](?!.*\.\.)[A-Za-z0-9._%+-]*[A-Za-z0-9]@([A-Za-z0-9-]+\.)+[A-Za-z]{2,6}$/;
    const phoneRegex = /^09\d{9}$/;
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;
    if (
      !emailRegex.test(userData.email) ||
      !phoneRegex.test(userData.phone) ||
      !nameRegex.test(userData.name)
    ) {
      throw new Error("Enter valid data");
    }
    if (!userData.password) {
      throw new Error("Password is required");
    }
    ///////////////////////////////////////////////////
    console.log(
      generator.generateId(),
      userData.name,
      userData.email,
      await generator.hashPassword(userData.password)
    );
    const isDuplicate = await userRepository.searchByEmail(userData.email);
    if (isDuplicate) {
      return { message: "User already exists" };
    }

    const newUser = {
      id: generator.generateId(),
      name: userData.name,
      email: userData.email,
      password: await generator.hashPassword(userData.password),
      phone: userData.phone,
      role_id: 1,
    };
    await userRepository.addUser(newUser);
    return { message: "User added successfully" };
  };
  const updateUserAvatar = async function (id, avatarUrl) {
    await userRepository.updateUserAvatar(id, avatarUrl);
    return { message: "User avatar updated successfully" };
  };
  const editUser = async function (id, userData) {
    const emailRegex =
      /^[A-Za-z0-9](?!.*\.\.)[A-Za-z0-9._%+-]*[A-Za-z0-9]@([A-Za-z0-9-]+\.)+[A-Za-z]{2,6}$/;
    const phoneRegex = /^09\d{9}$/;
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;
    if (
      (userData.email && !emailRegex.test(userData.email)) ||
      (userData.phone && !phoneRegex.test(userData.phone)) ||
      (userData.name && !nameRegex.test(userData.name))
    ) {
      throw new Error("Enter valid data");
    }

    const user = await userRepository.getUserById(id);
    if (!user) {
      throw new Error("User not found");
    }
    await userRepository.editUser(id, userData);
    return { message: "User updated successfully" };
  };
  const deleteUser = async function (id) {
    const user = await userRepository.getUserById(id);

    if (!user) {
      throw new Error("User not found");
    }
    await userRepository.deleteUser(id);
    return { message: "User deleted successfully" };
  };
  const getUserByEmailAndName = async function (query, page, limit) {
    const offset = (page - 1) * limit;
    const result = await userRepository.searchUser(query, limit, offset);
    return { users: result.users, totalCount: result.totalCount };
  };
  const getAllUsers = async function (page, limit) {
    const offset = (page - 1) * limit;
    const result = await userRepository.getAllUsers(limit, offset);
    return { users: result.users, totalCount: result.totalCount };
  };
  return {
    addUser,
    updateUserAvatar,
    editUser,
    deleteUser,
    getUserByEmailAndName,
    getAllUsers,
  };
}
module.exports = { userService };
