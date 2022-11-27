const jwt = require("jsonwebtoken");
const {config} = require('../config/secret');
exports.auth = (req, res, next) => {

    let token = req.header("x-api-key");
    if (!token) {
        return res.status(401).json({ msg: "You must be logged in token to this endpoint" });
    }
    try {
        let decodedToken = jwt.verify(token, `${config.tokenSecret}`);
        req.toeknData = decodedToken;
        next();
    } catch (error) {
        return res.status(404).json({ msg: "Token invalid or expired" });
    }

}