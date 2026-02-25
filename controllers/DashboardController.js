const { Order, User, Sequelize } = require('../models');
const { Op } = Sequelize;

const getDashboardStats = async (req, res) => {
    try {
        // Parallelize queries
        const [ordersCount, pendingCount, usersCount, completedOrders, recentOrders] = await Promise.all([
            Order.count(),
            Order.count({ where: { status: 'Pending' } }),
            User.count(),
            Order.findAll({
                where: { status: 'Completed' },
                attributes: ['total_amount', 'created_at']
            }),
            Order.findAll({
                limit: 5,
                order: [['created_at', 'DESC']],
                attributes: ['id', 'status', 'total_amount', 'created_at'],
                include: [{ model: User, attributes: ['full_name'] }]
            })
        ]);

        // Calculate limit and revenue data
        let totalRevenue = 0;
        let revenueData = [];

        if (completedOrders.length > 0) {
            totalRevenue = completedOrders.reduce((acc, curr) => acc + (parseFloat(curr.total_amount) || 0), 0);

            // Process Weekly Data
            const last7Days = [...Array(7)].map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - i);
                return {
                    date: d.toLocaleDateString('en-US', { weekday: 'short' }),
                    fullDate: d.toISOString().split('T')[0],
                    revenue: 0
                };
            }).reverse();

            completedOrders.forEach(order => {
                const orderDate = new Date(order.created_at).toISOString().split('T')[0];
                const day = last7Days.find(d => d.fullDate === orderDate);
                if (day) day.revenue += parseFloat(order.total_amount);
            });
            revenueData = last7Days;
        }

        res.status(200).json({
            stats: {
                totalRevenue,
                totalOrders: ordersCount,
                activeUsers: usersCount,
                pendingOrders: pendingCount
            },
            revenueData,
            recentOrders
        });

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getDashboardStats
};
