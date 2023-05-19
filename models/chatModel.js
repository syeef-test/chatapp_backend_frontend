const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Chats = sequelize.define('chats',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey: true,
        allownull: false
    },
    message:{
        type:Sequelize.STRING,
        allowNull:false
    },
    fileurl:{
        type:Sequelize.STRING,
        allowNull:true
    }
});


module.exports = Chats;