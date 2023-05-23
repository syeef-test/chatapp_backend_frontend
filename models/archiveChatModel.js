const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Archive = sequelize.define(
  "archive",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allownull: false,
    },
    message: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    fileurl: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Archive;
