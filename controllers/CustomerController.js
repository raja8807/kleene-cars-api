const { User } = require('../models');

const getCustomers = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    try {
        const { count, rows: customers } = await User.findAndCountAll({
            where: {
                role: 'customer'
            },
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        res.status(200).json({
            data: customers,
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
        });
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    getCustomers
};
