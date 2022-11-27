const mongoose = require('mongoose');
const {config} = require('../config/secret');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(`mongodb+srv://${config.userDB}:${config.userPass}@cluster0.w3qrn28.mongodb.net/idf77`);
  console.log("mongo connect idf 77 atlas");
  
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
} 