const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./models');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', require('./routes'));

// Test Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Kleene Cars API' });
});

// Error Handling Middleware
app.use(require('./middleware/errorHandler'));

// Database Connection and Server Startup
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');

        // Sync models (optional: set force to true to drop tables and recreate)
        // await sequelize.sync(); 

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

startServer();
