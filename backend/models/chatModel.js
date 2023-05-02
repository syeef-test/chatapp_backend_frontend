const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Chats = sequelize.define('chats',{
    id: {
        type: Sequelize.INTEGER,
        autoincrement: true,
        primaryKey: true,
        allownull: false
    },
    message:{
        type:Sequelize.STRING,
        allowNull:false
    }
});


module.exports = Chats;