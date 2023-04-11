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

      console.log(req.body.email);
  
      const user = await User.findAll({
        attributes: ["email"],
        where: { email: req.body.email },
      });
  
      if (typeof user !== "undefined" && user.length > 0) {
        res.status(401).json({ message: "User Allready Exist with same email",success:false});
      } else {

        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);
        if(hash){
            const insertData = await User.create({ name, email, password: hash ,phone:phone});
            res.status(201).json({ message: "Sign Up Succesful",success:true}); 
        }     
      }
    } catch (error) {
      console.log(error);
    }
  };