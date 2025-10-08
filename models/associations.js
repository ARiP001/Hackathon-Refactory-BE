const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const Rating = require('./Rating');
const Cart = require('./Cart');
const History = require('./History');

// User ↔ Product
User.hasMany(Product, { foreignKey: 'uuid', sourceKey: 'uuid' });
Product.belongsTo(User, { foreignKey: 'uuid', targetKey: 'uuid' });

// Category ↔ Product
Category.hasMany(Product, { foreignKey: 'category_id' });
Product.belongsTo(Category, { foreignKey: 'category_id' });

// User ↔ Rating (as target/source)
User.hasMany(Rating, { foreignKey: 'rating_target', sourceKey: 'uuid', as: 'receivedRatings' });
User.hasMany(Rating, { foreignKey: 'rating_source', sourceKey: 'uuid', as: 'givenRatings' });
Rating.belongsTo(User, { foreignKey: 'rating_target', targetKey: 'uuid', as: 'targetUser' });
Rating.belongsTo(User, { foreignKey: 'rating_source', targetKey: 'uuid', as: 'sourceUser' });

// Cart: User ↔ Product (through Cart rows)
User.hasMany(Cart, { foreignKey: 'user_id', sourceKey: 'uuid' });
Cart.belongsTo(User, { foreignKey: 'user_id', targetKey: 'uuid' });
Product.hasMany(Cart, { foreignKey: 'product_id' });
Cart.belongsTo(Product, { foreignKey: 'product_id' });

// History
User.hasMany(History, { foreignKey: 'uuid', sourceKey: 'uuid' });
History.belongsTo(User, { foreignKey: 'uuid', targetKey: 'uuid' });
Product.hasMany(History, { foreignKey: 'product_id' });
History.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = {
  User,
  Category,
  Product,
  Rating,
  Cart,
  History,
};


