const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
dotenv.config();
const sequelize = require("./util/database");
const path = require("path");


const User = require("./models/userModel");
const Chat = require("./models/chatModel");
const Group = require("./models/groupModel");
const UserGroup = require("./models/user_groupModel");



const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");
const groupRoute = require("./routes/groupRoute");




const app = express();
app.use(cors({
  origin:"*",
  methods:['GET','POST']
}));



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/user", userRoute);
app.use("/chat", chatRoute);
app.use("/group", groupRoute);


app.use((req,res)=>{
  console.log(req.url);
  res.sendFile(path.join(__dirname,`./public/${req.url}`));
});

User.hasMany(Chat);
Chat.belongsTo(User);

// The Super Many-to-Many relationship
User.belongsToMany(Group,{ through: UserGroup });
Group.belongsToMany(User,{ through: UserGroup });
User.hasMany(UserGroup);
UserGroup.belongsTo(User);
Group.hasMany(UserGroup);
UserGroup.belongsTo(Group);


Group.hasMany(Chat);
Chat.belongsTo(Group);







sequelize
  .sync()
  //.sync({force:true})
  .then((result) => {
    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => console.log(err));