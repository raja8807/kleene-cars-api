const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require('./User')(sequelize);
db.Address = require('./Address')(sequelize);
db.Banner = require('./Banner')(sequelize);
db.Category = require('./Category')(sequelize);
db.Order = require('./Order')(sequelize);
db.OrderItem = require('./OrderItem')(sequelize);
db.OrderEvidence = require('./OrderEvidence')(sequelize);
db.Product = require('./Product')(sequelize);
db.Service = require('./Service')(sequelize);
db.Vehicle = require('./Vehicle')(sequelize);
db.Worker = require('./Worker')(sequelize);
db.WorkerAssignment = require('./WorkerAssignment')(sequelize);
db.SubAdmin = require('./SubAdmin')(sequelize);
db.WorkerRating = require('./WorkerRating')(sequelize);
db.Payment = require('./Payment')(sequelize);
db.PaymentItem = require('./PaymentItem')(sequelize);


// Associations
// User Associations
db.User.hasMany(db.Address, { foreignKey: 'user_id' });
db.Address.belongsTo(db.User, { foreignKey: 'user_id' });

db.User.hasMany(db.Vehicle, { foreignKey: 'user_id' });
db.Vehicle.belongsTo(db.User, { foreignKey: 'user_id' });

db.User.hasMany(db.Order, { foreignKey: 'user_id' });
db.Order.belongsTo(db.User, { foreignKey: 'user_id' });

db.User.hasMany(db.WorkerRating, { foreignKey: 'user_id' });
db.WorkerRating.belongsTo(db.User, { foreignKey: 'user_id' });

// Category Associations
db.Category.hasMany(db.Service, { foreignKey: 'category_id' });
db.Service.belongsTo(db.Category, { foreignKey: 'category_id' });

// Order Associations
db.Order.belongsTo(db.Vehicle, { foreignKey: 'vehicle_id' });
db.Vehicle.hasMany(db.Order, { foreignKey: 'vehicle_id' });

db.Order.belongsTo(db.Address, { foreignKey: 'address_id' });
db.Address.hasMany(db.Order, { foreignKey: 'address_id' });

db.Order.hasMany(db.OrderItem, { foreignKey: 'order_id' });
db.OrderItem.belongsTo(db.Order, { foreignKey: 'order_id' });

db.OrderItem.belongsTo(db.Service, { foreignKey: 'item_id', as: 'ServiceDetail' });
db.OrderItem.belongsTo(db.Product, { foreignKey: 'item_id', as: 'ProductDetail' });

db.Order.hasMany(db.OrderEvidence, { foreignKey: 'order_id' });
db.OrderEvidence.belongsTo(db.Order, { foreignKey: 'order_id' });

db.Order.hasMany(db.WorkerAssignment, { foreignKey: 'order_id' });
db.WorkerAssignment.belongsTo(db.Order, { foreignKey: 'order_id' });

db.Order.hasOne(db.WorkerRating, { foreignKey: 'order_id' });
db.WorkerRating.belongsTo(db.Order, { foreignKey: 'order_id' });

// Worker Associations
db.Worker.hasMany(db.WorkerAssignment, { foreignKey: 'worker_id' });
db.WorkerAssignment.belongsTo(db.Worker, { foreignKey: 'worker_id' });

db.Worker.hasMany(db.WorkerRating, { foreignKey: 'worker_id' });
db.WorkerRating.belongsTo(db.Worker, { foreignKey: 'worker_id' });

// Payment Associations
db.Order.hasMany(db.Payment, { foreignKey: 'order_id' });
db.Payment.belongsTo(db.Order, { foreignKey: 'order_id' });

db.Worker.hasMany(db.Payment, { foreignKey: 'worker_id' });
db.Payment.belongsTo(db.Worker, { foreignKey: 'worker_id' });

db.User.hasMany(db.Payment, { foreignKey: 'user_id' });
db.Payment.belongsTo(db.User, { foreignKey: 'user_id' });

db.Payment.hasMany(db.PaymentItem, { foreignKey: 'payment_id' });
db.PaymentItem.belongsTo(db.Payment, { foreignKey: 'payment_id' });

db.PaymentItem.belongsTo(db.Service, { foreignKey: 'service_id' });
db.PaymentItem.belongsTo(db.Product, { foreignKey: 'product_id' });


module.exports = db;
