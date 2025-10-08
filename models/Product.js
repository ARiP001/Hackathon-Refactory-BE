const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  product_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  uuid: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  highlight_img: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  detail_img: {
    // Postgres array of TEXT
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: true,
    defaultValue: []
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  condition: {
    type: DataTypes.ENUM('like new', 'good', 'so so', 'bad', 'broken'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('available', 'sold'),
    allowNull: false,
    defaultValue: 'available'
  },
  total_qty: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  avail_qty: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: false,
  freezeTableName: true
});

module.exports = Product;


