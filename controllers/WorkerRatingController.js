const { WorkerRating, Worker, sequelize } = require('../models');
const { sendWorkerRatingNotification } = require('./WorkerNotificationController');

exports.createRating = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { order_id, worker_id, rating, comment } = req.body;
        const user_id = req.user.id;

        if (!order_id || !worker_id || !rating) {
            return res.status(400).json({ message: 'Order ID, Worker ID, and Rating are required' });
        }

        // 1. Create the rating
        const newRating = await WorkerRating.create({
            order_id,
            user_id,
            worker_id,
            rating,
            comment,
        }, { transaction: t });


        // Send push notification to worker (fire-and-forget)
        sendWorkerRatingNotification(worker_id, rating, order_id).catch(err =>
            console.error('Notification error (worker rated):', err)
        );

        res.status(201).json({
            message: 'Rating submitted successfully',
            rating: newRating,

        });

    } catch (error) {
        await t.rollback();
        console.error('Error in createRating:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'This order has already been rated' });
        }
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.getRatingByOrder = async (req, res) => {
    try {

        const { orderId } = req.params;
        const rating = await WorkerRating.findOne({
            where: { order_id: orderId }
        });

        res.status(200).json(rating);
    } catch (error) {
        console.error('Error in getRatingByOrder:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
