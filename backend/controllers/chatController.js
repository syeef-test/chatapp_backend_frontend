const User = require("../models/userModel");
const Chat = require("../models/chatModel");
// const { Sequelize, Op } = require("sequelize");
const { Op } = require("sequelize");

exports.addChat = async (req, res, next) => {
  // console.log(req.user.id);
  // console.log(req.body.content);
  try {
    const insertData = await req.user.createChat({
      message: req.body.content,
      groupId: parseInt(req.body.group_id),
    });
    if (insertData) {
      res
        .status(201)
        .json({ message: "Chat message sent succesful", success: true });
    } else {
      res.status(401).json({ message: "Chat data not sent", success: false });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getChat = async (req, res, next) => {
  try {
    //console.log("chat function called");
    const id = req.user.id;
    const lastmsgId = req.params.lastmsgId;
    const group_id = req.body.group_id;
    console.log("group id:", group_id);
    let last_id;
    if (lastmsgId === "undefined") {
      last_id = -1;
    } else {
      last_id = Number(lastmsgId);
    }

    const chatData = await Chat.findAll(
      {
        where: { groupId: group_id, id: { [Op.gt]: last_id } },
        order: [["createdAt", "DESC"]],
        limit:10
      },
      
         
      
    );

    // const chatData = await Chat.findAll({
    //     where:{id:{[Op.gt]: last_id},userId:id},
    // });
    //console.log(lastmsgId);
    //console.log(chatData.length);
    console.log("chat data of group", JSON.stringify(chatData, null, 2));
    if (chatData) {
      res
        .status(200)
        .json({ message: "Data Found", data: chatData, success: true });
    } else {
      res
        .status(200)
        .json({ message: "No Data Found", data: "", success: false });
    }
  } catch (error) {
    console.log(error);
  }
};
