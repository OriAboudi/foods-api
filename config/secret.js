require('dotenv').config();
exports.config = {
    userDB: process.env.USER_DB,
    userPass: process.env.PASSWORD_DB,
    tokenSecret: process.env.TOKEN_SECRET
}
console.log(process.env.USER_DB);