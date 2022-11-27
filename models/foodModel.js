const mongoose = require("mongoose");
// מודול לוולדזציה של מידע שמגיע מצד לקוח
// בבקשות פוסט ופוט לעריכה
const Joi = require("joi");

const foodSchema = new mongoose.Schema({
  name:String,
  cals:Number,
  price:Number,
  img_url:String,
  user_id:String
})


exports.FoodModel = mongoose.model("foods",foodSchema);

// פונקציה שמשתמש בג'וי שעושה וולדזציה בצד שרת
// למידע של הבאדי שהגיע מהצד לקוח
exports.validteFood = (reqBody) => {
  let joiSchema = Joi.object({
    name:Joi.string().min(2).max(150).required(),
    cals:Joi.number().min(0).max(9999).required(),
    price:Joi.number().min(1).max(9999).required(),
    // allow -> מאפשר לשלוח סטרינג ריק
    img_url:Joi.string().min(2).max(300).allow(null,"")
  })
  return joiSchema.validate(reqBody);
}