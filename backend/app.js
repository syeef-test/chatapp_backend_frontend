const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
dotenv.config();
const sequelize = require("./util/database");


const User = require("./models/userModel");
const Chat = require("./models/chatModel");
const Group = require("./models/groupModel");
const UserGroup = require("./models/user_groupModel");



const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");
const groupRoute = require("./routes/groupRoute");


const app = express();
app.use(cors({
  origin:"http://127.0.0.1:5500",
  methods:['GET','POST']
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/user", userRoute);
app.use("/chat", chatRoute);
app.use("/group", groupRoute);

User.hasMany(Chat);
Chat.belongsTo(User);

User.belongsToMany(Group,{ through: UserGroup });
Group.belongsToMany(User,{ through: UserGroup });

// User.hasMany(user_group);
// user_group.belongsTo(User);
// Group.hasMany(user_group);
// user_group.belongsTo(Group);

Group.hasMany(Chat);
Chat.belongsTo(Group);







sequelize
  .sync()
  //.sync({force:true})
  .then((result) => {
    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => console.log(err));