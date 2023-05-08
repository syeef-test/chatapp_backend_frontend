const User = require("../models/userModel");
const Group = require("../models/groupModel");
const Message = require("../models/chatModel");
const UserGroup = require("../models/user_groupModel");

const { Op } = require("sequelize");
const sequelize = require("../util/database");

exports.createGroup = async (req, res, next) => {
  try {
    //const response = await req.user.createGroup({ name: req.body.group_name});

    const groupInstance = await Group.create({ name: req.body.group_name });
    const data = await req.user.addGroup(groupInstance.id, {
      through: { isAdmin: true },
    });

    //need to show participate button otherwise need to login agaian
    // const groupInstance = await Group.findAll({
    //   attributes:['id','name'],
    //   include:[
    //     {
    //       model:UserGroup,
    //       attributes:['isAdmin','userId'],
    //       where:{userId:req.user.id},
    //     }
    //   ]
    // });
    
    // console.log(JSON.stringify(groupInstance, null, 2));
    // console.log(JSON.stringify(data, null, 2));
    if (data) {
      res.status(201).json({
        message: "Group Created Succesfully",
        data: groupInstance,
        success: true,
      });
    } else {
      res
        .status(401)
        .json({ message: "Please Try Again Later", data: "", success: false });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getGroup = async (req, res, next) => {
  try {
    //const groupInstance = await req.user.getGroups();

    const groupInstance = await Group.findAll({
      attributes:['id','name'],
      include:[
        {
          model:UserGroup,
          attributes:['isAdmin','userId'],
          where:{userId:req.user.id},
        }
      ]
    });
    //console.log(JSON.stringify(groupInstance,null,2));
    
    
    let isAdmin = 0;
    groupInstance.forEach(element => {
      //console.log("usergroup:",element);
      if(element.user_groups[0].isAdmin === true){
        isAdmin = 1;
      }
    });
    

    //console.log(groupInstance);
    if (groupInstance.length > 0) {
      res.status(200).json({
        message: "Group Data Found",
        data: groupInstance,
        isAdmin:isAdmin,
        success: true,
      });
    } else {
      res.status(401).json({
        message: "Please Try Again Later No Data Found",
        data: "",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getGroupForDropdown = async (req, res, next) => {
  try {
    //const groupInstance = await req.user.getGroups();


    // const [results, metadata] = await sequelize.query(
    //   `SELECT * FROM user_groups JOIN users ON user_groups.userId = users.id where users.id = ${req.user.id}`
    // );
    // const [results, metadata] = await sequelize.query(
    //   `SELECT * FROM groups LEFT JOIN user_groups ON groups.id = user_groups.groupId LEFT JOIN users ON user_groups.userId = ${req.user.id}`
    // );
    // const [groupInstance] = await sequelize.query(
    //   "SELECT `groups`.`id`, `groups`.`name`, `groups`.`createdAt`, `groups`.`updatedAt`, `user_group`.`id` AS `user_group.id`, `user_group`.`isAdmin` AS `user_group.isAdmin`, `user_group`.`userId` AS `user_group.userId`, `user_group`.`groupId` AS `user_group.groupId` FROM `groups` AS `groups` INNER JOIN `user_groups` AS `user_group` ON `groups`.`id` = `user_group`.`groupId` AND `user_group`.`userId` = 1 AND user_group.isAdmin=1"
    // );

  //   const groupInstance = await sequelize.query(
  //     `SELECT 'groups'.'id', 'groups'.'name', 'groups'.'createdAt', 'groups'.'updatedAt', 'user_group'.'id' AS 'user_group.id', 'user_group'.'isAdmin' 
	// AS 'user_group.isAdmin', 'user_group'.'userId' AS 'user_group.userId', 'user_group'.'groupId' AS 'user_group.groupId' FROM 'groups' AS 'groups' 
	// INNER JOIN 'user_groups' AS 'user_group' ON 'groups'.'id' = 'user_group'.'groupId' AND 'user_group'.'userId' = 1 AND 'user_group.isAdmin'=1`);

    // const groupInstance = await Group.findAll({
    //   include: [{
    //     model: User 
    //   }]
    // });

    // const userInstance = await User.findAll({
    //   where:{id:req.user.id},
    //   include: [{
    //     model: UserGroup,
    //     where:{ isAdmin: { [Op.eq]: 1 } },
    //     include:[
    //       {
    //         model:Group
    //       }
    //     ] 
    //   }]
    // });

    const groupInstance = await Group.findAll({
      attributes:['id','name'],
      include:[
        {
          model:UserGroup,
          attributes:['isAdmin','userId'],
          where:{userId:req.user.id,isAdmin:1}
        }
      ]
    });


    
    console.log("JOIN RESULT:",JSON.stringify(groupInstance, null, 2));

    if (groupInstance.length > 0) {
      res.status(200).json({
        message: "Group Data Found",
        data: groupInstance,
        success: true,
      });
    } else {
      res.status(401).json({
        message: "Please Try Again Later No Data Found",
        data: "",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.addParticipent = async (req, res, next) => {
  try {
    console.log(req.body);
    const group_id = req.body.group_id;
    const user_ids = req.body.user_ids;
    const type = req.body.type;
    const action = req.body.action;

    if (action === "Add") {
      if (user_ids.length > 0) {
        let flag = 0;
        for (i = 0; i < user_ids.length; i++) {
          let userInstance = await User.findByPk(user_ids[i]);
          let groupInstance = await Group.findByPk(group_id);
          const data = await userInstance.addGroup(groupInstance, {
            through: { isAdmin: type },
          });
          if (data) {
            flag += 1;
          }
        }
        if (flag === user_ids.length) {
          res
            .status(201)
            .json({
              message: "User Added To Group Succesfully",
              success: true,
            });
        } else {
          res
            .status(401)
            .json({ message: "Please Try Again Later", success: false });
        }
      }
    } else {
      if (user_ids.length > 0) {
        let flag = 0;
        for (i = 0; i < user_ids.length; i++) {
          let userInstance = await User.findByPk(user_ids[i]);
          let groupInstance = await Group.findByPk(group_id);
          const data = await userInstance.removeGroup(groupInstance, {
            through: { isAdmin: type },
          });
          if (data) {
            flag += 1;
          }
        }
        if (flag === user_ids.length) {
          res
            .status(201)
            .json({ message: "User Deleted Succesfully", success: true });
        } else {
          res
            .status(401)
            .json({ message: "Please Try Again Later", success: false });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getData = async (req, res, next) => {
  try {
    // console.log(req.body.query);
    // console.log("called");

    const allUsers = await User.findAll({
      attributes: ["id", "name", "email"],
      where: { name: { [Op.substring]: req.body.query } },
    });

    if (allUsers.length > 0) {
      res
        .status(200)
        .json({ message: "User Data Found", data: allUsers, success: true });
    } else {
      res.status(401).json({
        message: "Please Try Again Later No Data Found",
        data: "",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.leftGroup = async(req,res,next)=>{
  try{
    console.log(req.body);
    const group_id = req.body.group_id;
    const user_id = req.user.id;

    const response = await UserGroup.findOne({where:{groupId:group_id,userId:user_id}});
    console.log(response);
    const data = response.destroy();
    console.log(data);

    if (data) {
      res
        .status(200)
        .json({ message: "Left Group Succesful", success: true });
    } else {
      res.status(401).json({
        message: "Please Try Again Later",
        data: "",
        success: false,
      });
    }

  }catch(error){
    console.log(error);
  }
}
