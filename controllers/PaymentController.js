const { Payment, PaymentItem, sequelize } = require('../models');
const { sendOrderUpdateNotification } = require('./CustomerNotificationController');

const createPayment = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { order_id, worker_id, user_id, items } = req.body;

        if (!order_id || !worker_id || !user_id || !items || !Array.isArray(items)) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if payment already exists for this order
        let payment = await Payment.findOne({ where: { order_id } });

        if (payment) {
            // Update existing payment
            await payment.update({
                worker_id,
                user_id,
                status: 'Pending' // Reset to pending if it was somehow different
            }, { transaction: t });

            // Remove existing items to replace them
            await PaymentItem.destroy({
                where: { payment_id: payment.id },
                transaction: t
            });
        } else {
            // Create new payment
            payment = await Payment.create({
                order_id,
                worker_id,
                user_id,
                status: 'Pending'
            }, { transaction: t });
        }

        const paymentItems = items.map(item => ({
            payment_id: payment.id,
            type: item.type,
            service_id: item.service_id || null,
            product_id: item.product_id || null,
            name: item.name,
            price: item.price,
            quantity: item.quantity || 1
        }));

        await PaymentItem.bulkCreate(paymentItems, { transaction: t });

        await t.commit();

        // Calculate total price for UPI URI
        const totalPrice = items.reduce((sum, item) => sum + (parseFloat(item.price) * parseInt(item.quantity || 1)), 0);

        const upiUri = `upi://pay?pa=s.rajarathinam1999-1@okaxis&pn=Raja&am=${totalPrice}&cu=INR&tn=${order_id}`;

        res.status(payment ? 200 : 201).json({
            message: payment ? 'Payment updated successfully' : 'Payment initiated successfully',
            payment: payment,
            upiUri: upiUri
        });
    } catch (error) {
        await t.rollback();
        console.error('Error handling payment:', error);
        res.status(500).json({ error: error.message });
    }
};

const updatePaymentStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const t = await sequelize.transaction();
    try {
        const payment = await Payment.findByPk(id, { transaction: t });
        if (!payment) {
            await t.rollback();
            return res.status(404).json({ error: 'Payment not found' });
        }

        await payment.update({ status }, { transaction: t });

        if (status === 'Completed') {
            await sequelize.models.Order.update({
                status: 'Completed',
                completed_at: new Date()
            }, {
                where: { id: payment.order_id },
                transaction: t
            });

            // Send thank you notification to customer
            sendOrderUpdateNotification(payment.user_id, payment.order_id, 'Payment Received').catch(err =>
                console.error('Notification error (payment received):', err)
            );
        }

        await t.commit();
        res.status(200).json({ message: 'Payment status updated successfully', payment });
    } catch (error) {
        await t.rollback();
        console.error('Error updating payment status:', error);
        res.status(500).json({ error: error.message });
    }
};

const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.findAll({
            include: [
                { model: PaymentItem },
                {
                    model: sequelize.models.Order,
                    include: [
                        { model: sequelize.models.User },
                        { model: sequelize.models.Vehicle }
                    ]
                },
                { model: sequelize.models.Worker }
            ],
            order: [['created_at', 'DESC']]
        });

        res.status(200).json(payments);
    } catch (error) {
        console.error('Error fetching all payments:', error);
        res.status(500).json({ error: error.message });
    }
};

const getPaymentByOrderId = async (req, res) => {
    const { order_id } = req.params;
    try {
        const payment = await Payment.findOne({
            where: { order_id },
            include: [{ model: PaymentItem }]
        });

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found for this order' });
        }

        res.status(200).json(payment);
    } catch (error) {
        console.error('Error fetching payment:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createPayment,
    updatePaymentStatus,
    getPaymentByOrderId,
    getAllPayments
};
