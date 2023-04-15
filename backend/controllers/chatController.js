
const User = require('../models/userModel');
const Chat = require('../models/chatModel');


exports.addChat = async (req, res, next) => {
    // console.log(req.user.id);
    // console.log(req.body.content);
    try {
        const insertData = await req.user.createChat({message: req.body.content });
        if (insertData) {
            res.status(201).json({ message: "Chat message sent succesful", success: true });
        } else {
            res.status(401).json({ message: "Chat data not sent", success: false });
        }
    } catch (error) {
        console.log(error);
    }

}

exports.getChat = async(req,res,next) => {
    try{
        const id = req.user.id;
        
        const chatData = await Chat.findAll({where:{userId:id}});
        console.log(chatData);
        if(chatData){
            res.status(200).json({ message: "Data Found", data:chatData,success: true });
        }else{
            res.status(200).json({ message: "No Data Found",success: false });
        }
    }catch(error){
        console.log(error);
    }
}