const bcrypt = require("bcrypt");
// const jwt
//  = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const { ServerConfig } = require("../../config");
function checkPassword(plainPassword, encrpytedPassword) {
  try {
    return bcrypt.compareSync(plainPassword, encrpytedPassword);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
function generateJWT(payload) {
  try {
    return jwt.sign(payload, ServerConfig.JWT_SECRET, {
      expiresIn: "1h",
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
function verifyToken(token) {
  try {
    return jwt.verify(token, ServerConfig.JWT_SECRET);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
// const token = generateJWT({ email: "vi@gmail.com", id: 1 });
// console.log(token);
// const res = verifyToken(
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkXVCJ9.eyJlbWFpbCI6InZpQGdtYWlsLmNvbSIsImlkIjoxLCJpYXQiOjE3Mzc5OTgzNjAsImV4cCI6MTczODAwNTU2MH0.cAarPkS0H8Ie1i3xzLiXYd8uzJj7uLYume26sYZcWvg"
// );
// console.log(res);
module.exports = {
  checkPassword,
  generateJWT,
  verifyToken,
};
