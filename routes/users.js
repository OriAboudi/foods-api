const express = require("express");
const bcrypt = require("bcrypt");
const {auth}= require('../middlewares/auto')
const { validteUser, UserModel, validteLogin, createToken } = require("../models/userModel");

const router = express.Router();

router.get("/", async (req, res) => {
  res.json({ msg: "Users work" });
})

router.get('/myInfo', auth, async (req, res) => {
  try {
    let data = await UserModel.findOne({ _id: req.toeknData._id }, { password: 0 });
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }

})

// מאזין לכניסה לראוט של העמוד בית לפי מה שנקבע לראוטר
// בקובץ הקונפיג

// הרשמה של משתמש חדש
router.post("/", async (req, res) => {
  let validBody = validteUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user = new UserModel(req.body);
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();

    user.password = "*****";
    res.status(201).json(user)
  }
  catch (err) {
    if (err.code = 11000) {
      return res.status(401).json({ msg: "email already in the system ", code: 11000 });
    }
    console.log(err);
    res.status(500).json(err);
  }
})
// לוג אין משתמש קיים שבסופו מקבל טוקן 
router.post("/login", async (req, res) => {
  let validBody = validteLogin(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    // לבדוק אם מייל קייים בכלל במערכת
    let user = await UserModel.findOne({ email: req.body.email })
    if (!user) {
      return res.status(401).json({ msg: "User or password not match , code:1" })
    }
    // שהסיסמא שהגיעה מהבאדי בצד לוקח תואמת לסיסמא המוצפנת במסד
    let passordValid = await bcrypt.compare(req.body.password, user.password)
    if (!passordValid) {
      return res.status(401).json({ msg: "User or password not match " })
    }
    let token = createToken(user._id);
    res.json({ token: token })
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})

module.exports = router;