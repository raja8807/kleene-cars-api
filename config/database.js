const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false, // Set to console.log to see SQL queries
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // Adjust based on your DB provider (e.g., Supabase, Heroku)
        }
    }
});

module.exports = sequelize;
