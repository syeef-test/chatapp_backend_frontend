
const User = require('../models/userModel');


exports.addChat = async (req, res, next) => {
    // console.log(req.user.id);
    // console.log(req.body.content);
    try {
        const insertData = await req.user.createChat({ sent_to: 2, message: req.body.content });
        if (insertData) {
            res.status(201).json({ message: "Chat message sent succesful", success: true });
        } else {
            res.status(401).json({ message: "Chat data not sent", success: false });
        }
    } catch (error) {
        console.log(error);
    }

}