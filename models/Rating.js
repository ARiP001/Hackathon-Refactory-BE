const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rating = sequelize.define('Rating', {
  rating_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  rating_target: {
    // target user uuid
    type: DataTypes.STRING,
    allowNull: false
  },
  rating_source: {
    // source user uuid
    type: DataTypes.STRING,
    allowNull: false
  },
  rating_value: {
    type: DataTypes.ENUM('1', '2', '3', '4', '5'),
    allowNull: false
  },
  rating_message: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: false,
  freezeTableName: true
});

module.exports = Rating;


