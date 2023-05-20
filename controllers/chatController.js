const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const Group = require("../models/groupModel");
const { Op } = require("sequelize");
const S3Service = require("../services/s3services");

const jwt = require("jsonwebtoken");

module.exports.respond = function (socket_io) {
  //console.log("called_socket io controller");

  //ADD MESSAGE TO DB
  socket_io.on("send_message", async (obj) => {
    //console.log(obj);
    //if no group id null
    //verify token
    const userObj = jwt.verify(obj.token, process.env.JSONTOKEN_SECRET);

    if (userObj) {
      const group_id = obj.group_id;
      const content = obj.content;

      if (obj.fileInput) {
        const fileBuffer = obj.fileInput[0];
        const fileName = obj.file_name;
        const fileSize = obj.file_size;
        const fileType = obj.file_type;
        const newFilename = (new Date().getTime() + fileName).toString();
        var fileURL = await S3Service.uploadToS3(fileBuffer, newFilename);
      }
      if (!fileURL) {
        var fileURL = "";
      }
      let insertData = await Chat.create({
        message: content,
        groupId: parseInt(group_id),
        userId: userObj.userId,
        fileurl: fileURL,
      });

      //console.log(insertData);
      const chatId = insertData.id;
      const message = insertData.message;
      const groupid = insertData.groupId;
      const userId = insertData.userId;

      const chatData = await Chat.findOne({
        where: { groupId: groupid, id: chatId },
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: User,
            attributes: ["name"],
          },
        ],
      });
      //console.log("singale chat", JSON.stringify(chatData, null, 2));

      const group = await Group.findOne({ where: { id: group_id } });
      const groupName = group.name;
      // // socket_io.join(groupName);
      socket_io.broadcast
        .to(groupName)
        .emit("recive_message", { chatData: chatData });

      socket_io.emit("recive_message", { chatData: chatData });
    }
  });

  //JOIN GROUP
  socket_io.on("join_group", async (obj) => {
    //console.log(obj);
    const group_id = obj.group_id;

    const userObj = jwt.verify(obj.token, process.env.JSONTOKEN_SECRET);
    if (userObj) {
      const group = await Group.findOne({ where: { id: group_id } });
      const groupName = group.name;
      //console.log("group details",groupName);
      const chatData = await Chat.findAll({
        where: { groupId: group_id },
        order: [["createdAt", "ASC"]],
        include: [
          {
            model: User,
            attributes: ["name"],
          },
        ],
      });
      //console.log("chat data of group", JSON.stringify(chatData, null, 2));
      socket_io.join(groupName);
      socket_io.emit("recive_message", {
        groupName: groupName,
        chatData: chatData,
      });

      socket_io.emit("status_message", {
        message: `${userObj.name} connected to ${groupName}`,
      });

      //to all user of group
      socket_io.broadcast
        .to(groupName)
        .emit("status_message", { message: `${userObj.name} joined` });
    }
  });

  //LEAVE GROUP
  socket_io.on("disconnect_group", async (obj) => {
    console.log(obj);
    const userObj = jwt.verify(obj.token, process.env.JSONTOKEN_SECRET);
    console.log(userObj);
    if (userObj) {
      const group_id = obj.group_id;
      const group = await Group.findOne({ where: { id: group_id } });
      const groupName = group.name;
      socket_io.leave(groupName);

      socket_io.emit("status_message", {
        message: `${userObj.name} disconnected from ${groupName}`,
      });

      //to all user of group
      socket_io.broadcast
        .to(groupName)
        .emit("status_message", { message: `${userObj.name} left` });
    }
  });

  // socket_io.on('error', (err) => {
  //   console.log(`Error: ${err}`);
  // });
};

// function parseJwt(token) {
//   return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
// }

// function findUserById(id){
//   try{
//     const user = User.findOne({where:{id:id}});
//     return user;
//   }catch(error){
//     console.log(error);
//   }
// }

// socket.on("get_message", (obj) => {
//   console.log(obj);
// });

//old http code

// exports.addChat = async (req, res, next) => {
//   // console.log(req.user.id);
//   // console.log(req.body.content);
//   try {
//     const insertData = await req.user.createChat({
//       message: req.body.content,
//       groupId: parseInt(req.body.group_id),
//     });
//     if (insertData) {
//       res
//         .status(201)
//         .json({ message: "Chat message sent succesful", success: true });
//     } else {
//       res.status(401).json({ message: "Chat data not sent", success: false });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

// exports.getChat = async (req, res, next) => {
//   try {
//     //console.log("chat function called");
//     const id = req.user.id;
//     const lastmsgId = req.params.lastmsgId;
//     const group_id = req.body.group_id;
//     console.log("group id:", group_id);
//     let last_id;
//     if (lastmsgId === "undefined") {
//       last_id = -1;
//     } else {
//       last_id = Number(lastmsgId);
//     }

//     const chatData = await Chat.findAll(
//       {
//         where: { groupId: group_id, id: { [Op.gt]: last_id } },
//         order: [["createdAt", "ASC"]],
//         limit:10,
//         include:[
//           {
//             model:User,
//             attributes:['name'],
//             // where:{id:req.user.id}
//           }
//         ]
//       },
//     );

//     // const chatData = await Chat.findAll({
//     //     where:{id:{[Op.gt]: last_id},userId:id},
//     // });
//     //console.log(lastmsgId);
//     //console.log(chatData.length);
//     console.log("chat data of group", JSON.stringify(chatData, null, 2));
//     if (chatData) {
//       res
//         .status(200)
//         .json({ message: "Data Found", data: chatData, success: true });
//     } else {
//       res
//         .status(200)
//         .json({ message: "No Data Found", data: "", success: false });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };
