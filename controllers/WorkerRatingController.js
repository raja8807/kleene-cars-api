const { WorkerRating, Worker, sequelize } = require('../models');

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

        // 2. Calculate new average rating for the worker
        const ratings = await WorkerRating.findAll({
            where: { worker_id },
            transaction: t,
        });

        const totalRating = ratings.reduce((sum, r) => sum + parseFloat(r.rating), 0);
        const averageRating = (totalRating / ratings.length).toFixed(1);

        // 3. Update the worker's average rating
        await Worker.update(
            { rating: averageRating },
            {
                where: { id: worker_id },
                transaction: t
            }
        );

        await t.commit();

        res.status(201).json({
            message: 'Rating submitted successfully',
            rating: newRating,
            newAverageRating: averageRating
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

        console.log('ok');


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
