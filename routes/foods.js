const express = require("express");
const { auth } = require("../middlewares/auto");
const { FoodModel, validteFood } = require("../models/foodModel")
const router = express.Router();
//min - max -
router.get("/calories", async (req, res) => {

  try {
    let min = Number(req.query.min) || 1;
    let max = Number(req.query.max) || 999;
    let data = await FoodModel.find({ cals: { $gte: min, $lte: max } })
      .limit(20)
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})


router.get("/", async (req, res) => {
  // אם לא מוצא את קווארי פר פייג' ערך שווה 4
  let perPage = Number(req.query.perPage) || 4;
  let page = Number(req.query.page) || 1
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? 1 : -1;

  try {
    let data = await FoodModel
      .find({})
      // יציג רק 4 רשומות למרות שיש יותר בוקלקשין
      .limit(perPage)
      // כמה רשומות לעבור ומאיפה להתחיל
      // במקרה הזה מתחיל מ5 עד 8
      .skip((page - 1) * perPage)
      // 1-> מחפש מהקטן לגדול ASC
      // -1 -> מהגדול לקטן DESC
      // [] -> סוגריים מרובעות במאפיין אומרות לקחת את הערך של המשתנה שלו ולא את השם שלו כמאפיין
      .sort({ [sort]: reverse })
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
  // res.json({msg:"Foods work"});
})

router.get("/userList", auth, async (req, res) => {
  // אם לא מוצא את קווארי פר פייג' ערך שווה 4
  let perPage = Number(req.query.perPage) || 4;
  let page = Number(req.query.page) || 1
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? 1 : -1;

  try {
    let data = await FoodModel
      .find({ user_id: req.toeknData._id })
      // יציג רק 4 רשומות למרות שיש יותר בוקלקשין
      .limit(perPage)
      // כמה רשומות לעבור ומאיפה להתחיל
      // במקרה הזה מתחיל מ5 עד 8
      .skip((page - 1) * perPage)
      // 1-> מחפש מהקטן לגדול ASC
      // -1 -> מהגדול לקטן DESC
      // [] -> סוגריים מרובעות במאפיין אומרות לקחת את הערך של המשתנה שלו ולא את השם שלו כמאפיין
      .sort({ [sort]: reverse })
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
  // res.json({msg:"Foods work"});
})

// ?s=
router.get("/search", async (req, res) => {
  try {
    let searchQ = req.query.s;
    // i -> פותר את הבעיית קייס סינסטיב של אותיות גדולות /קטנות
    let searchExp = new RegExp(searchQ, "i")
    let data = await FoodModel.find({ name: searchExp })
      // מגבילים ל20 כדי שאם בטעות שיש חיפוש של אות
      //אחת שלא ישלוף מהמסד מאות ואלפי רשומות
      .limit(20)
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
});


router.post("/", auth, async (req, res) => {
  let validBody = validteFood(req.body);
  // אם יש טעות יזהה מאפיין אירור בולידבאדי
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }

  try {
    // req.body -> קיים בבקשות פוסט הוספה  ופוט עריכה
    // ששולחים או עורכים מידע
    let food = new FoodModel(req.body)
    // להוסיף את עצמו כרשומה
    //להוסיף איי די לכל רשומה חדשה שנוספת 
    food.user_id = req.toeknData._id
    await food.save();

    // אם הצליח נקבל את הבאדים פלוס מאפפין איי די
    // ו _V
    // 201 - הצלחה - ונוספה רשומה חדשה במסד
    res.status(201).json(food);
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})

// עריכה
router.put("/:idEdit", auth, async (req, res) => {
  let validBody = validteFood(req.body);
  // אם יש טעות יזהה מאפיין אירור בולידבאדי
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let idEdit = req.params.idEdit;
    let data = await FoodModel.updateOne({ _id: idEdit, user_id: req.toeknData._id }, req.body)
    // modfiedCount : 1 - אם הצליח לערוך נקבל בצד לקוח בחזרה
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

router.delete("/:idDel", auth, async (req, res) => {
  let idDel = req.params.idDel;
  try {
    let data = await FoodModel.deleteOne({
      _id: idDel, user_id: req.toeknData._id
    })
    // deleteCount : 1 - אם הצליח למחוק נקבל בצד לקוח בחזרה
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})


module.exports = router;