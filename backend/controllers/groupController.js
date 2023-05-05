const User = require('../models/userModel');
const Group = require('../models/groupModel');
const Message = require('../models/chatModel');
const UserGroup = require('../models/user_groupModel');

const { op } = require('sequelize');
const sequelize = require("../util/database");

exports.createGroup = async (req, res, next) => {
    try {
        const response = await req.user.createGroup({ name: req.body.group_name });
        //console.log(response.dataValues);
        if (response) {
            res.status(201).json({ message: "Group Created Succesfully", data: response.dataValues, success: true });
        } else {
            res.status(401).json({ message: "Please Try Again Later", data: '', success: false });
        }
    } catch (error) {
        console.log(error);
    }

}

exports.getGroup = async (req, res, next) => {
    try {
        //const userId = req.user.id;
        //console.log(userId);
        //const userInstance = await User.findOne({where:{id:userId}});
        
        const groupInstance = await req.user.getGroups();
        console.log(groupInstance);
        if (groupInstance.length>0) {
            res.status(200).json({ message: "Group Data Found", data: groupInstance, success: true });
        } else {
            res.status(401).json({ message: "Please Try Again Later No Data Found", data: '', success: false });
        }
        
    } catch (error) {
        console.log(error);
    }

}

exports.getGroupForDropdown = async(req,res,next) =>{
    try{
        const allUsers = await User.findAll(
            {attributes: ['id', 'name','email']},
        );
        //console.log("All users:", JSON.stringify(allUsers, null, 2));
        const groupInstance = await req.user.getGroups();
        //console.log(groupInstance);
        if (groupInstance.length>0) {
            res.status(200).json({ message: "Group Data Found", data: groupInstance,data2:allUsers, success: true });
        } else {
            res.status(401).json({ message: "Please Try Again Later No Data Found", data: '', success: false });
        }
    }catch(error){
        console.log(error);
    }
}

exports.addParticipent = async(req,res,next)=>{
    try{
        console.log(req.body);
        const group_id = req.body.group_id;
        const user_id = req.body.user_id;

        // const userInstance = await User.findOne({where:{id:user_id}});
        // console.log("user detail",JSON.stringify(userInstance, null, 2));

        let userInstance = await User.findByPk(user_id);
        let groupInstance = await Group.findByPk(group_id);
        const data = await userInstance.addGroup(groupInstance, {through:UserGroup});
       
        console.log("data",JSON.stringify(data, null, 2));

        if (data) {
            res.status(201).json({ message: "User Added To Group Succesfully", success: true });
        } else {
            res.status(401).json({ message: "Please Try Again Later", success: false });
        }

    }catch(error){
        console.log(error);
    }
}


