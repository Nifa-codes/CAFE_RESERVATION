const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
function loginService(userRepository, tokenRepository) {
  const login = async function (password, email) {
    const user = await userRepository.searchByEmail(email);
    if (!user) {
      throw new Error("incorrect password or email");
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error("incorrect password or email");
    }
    const accessToken = jwt.sign(
      {
        //payload
        role: user.role_id,
        sub: user.id,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIERS }
    );

    const refreshToken = jwt.sign(
      {
        sub: user.id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES,
      }
    );
    await tokenRepository.saveRefreshToken(
      user.id,
      refreshToken,
      process.env.REFRESH_TOKEN_EXPIRES
    );
    return {
      message: "login successful",
      accessToken,
      refreshToken,
    };
  };
  return { login };
}
module.exports = {
  loginService,
};
