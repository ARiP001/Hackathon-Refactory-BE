const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const History = sequelize.define('History', {
  history_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  uuid: {
    type: DataTypes.STRING,
    allowNull: false
  },
  product_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  payment_type: {
    type: DataTypes.ENUM('Cod', 'cash', 'Digital'),
    allowNull: false
  }
}, {
  timestamps: false,
  freezeTableName: true
});

module.exports = History;


