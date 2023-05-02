const User = require("../models/userModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.postSignup = async (req, res, next) => {
  try {
    //console.log(req.body);
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const phone = req.body.phonenumber;

    //console.log(req.body.email);

    const user = await User.findAll({
      attributes: ["email"],
      where: { email: req.body.email },
    });

    if (typeof user !== "undefined" && user.length > 0) {
      res.status(401).json({ message: "User already exists, Please Login", success: false });
    } else {

      const saltRounds = 10;
      const hash = await bcrypt.hash(password, saltRounds);
      if (hash) {
        const insertData = await User.create({ name, email, password: hash, phone: phone });
        res.status(201).json({ message: "Sign Up Succesful", success: true });
      }
    }
  } catch (error) {
    console.log(error);
  }
};


exports.generateAccessToken = (id, name) => {
  return jwt.sign({ userId: id, name: name }, process.env.JSONTOKEN_SECRET);
};


exports.postLogin = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userDetails = await User.findAll({
      attributes: ['email', 'password', 'id','name'],
      where: { email: email }
    });

    if (typeof userDetails !== "undefined" && userDetails.length > 0) {
      const match = await bcrypt.compare(password, userDetails[0].password);
      if (match) {
        res.status(200).json({ message: "User Login Succesful", token: this.generateAccessToken(userDetails[0].id, userDetails[0].name),name:userDetails[0].name, success: true });
      } else {
        res.status(401).json({ message: "User Not authorized", success: false });
      }
    } else {
      res.status(404).json({ message: "User Does not exist", success: false });
    }
  } catch (error) {
    console.log(error);
  }
};