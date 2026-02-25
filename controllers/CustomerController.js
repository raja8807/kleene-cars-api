const { User } = require('../models');

const getCustomers = async (req, res) => {
    try {
        const customers = await User.findAll({
            order: [['created_at', 'DESC']]
        });
        res.status(200).json(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getCustomers
};
