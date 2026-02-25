const { Order, User, Vehicle, Address, OrderItem, WorkerAssignment, OrderEvidence } = require('../models');

const getOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                { model: User, attributes: ['full_name', 'phone'] },
                { model: Vehicle, attributes: ['brand', 'model', 'number', 'type'] },
                { model: Address, attributes: ['house', 'street', 'area', 'city', 'pincode'] },
                { model: OrderItem, attributes: ['name', 'price', 'item_type'] },
            ],
            order: [['created_at', 'DESC']]
        });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: error.message });
    }
};

const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findOne({
            where: { id },
            include: [
                { model: User, attributes: ['full_name', 'phone'] },
                { model: Vehicle, attributes: ['brand', 'model', 'number', 'type'] },
                { model: Address, attributes: ['house', 'street', 'area', 'city', 'pincode'] },
                { model: OrderItem, attributes: ['name', 'price', 'item_type'] },
            ]
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: error.message });
    }
};

const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, worker_id, ...otherUpdates } = req.body;

        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Handle Worker Assignment
        if (worker_id) {
            // 1. Insert into worker_assignments
            await WorkerAssignment.create({
                order_id: id,
                worker_id: worker_id,
                status: 'Assigned'
            });

            // 2. Update Order Status
            await order.update({
                status: 'Worker Assigned'
            });

            return res.status(200).json(order);
        }

        // Update status or other fields
        if (status) {
            await order.update({ status });
            return res.status(200).json(order);
        }

        // Generic update
        await order.update(otherUpdates);
        res.status(200).json(order);

    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getOrders,
    getOrderById,
    updateOrder
};
