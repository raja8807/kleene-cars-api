const { User } = require('../models');
const { sendNotification } = require('./NotificationController');

const statusMap = {
    'Booked': { title: 'Order Booked', body: 'Your order has been booked successfully' },
    'Confirmed': { title: 'Order Confirmed', body: 'Your order has been confirmed' },
    'Worker Assigned': { title: 'Worker Assigned', body: 'A worker has been assigned to your order' },
    'Worker Reached Location': { title: 'Worker Reached Location', body: 'Your worker has reached the location' },
    'Service Ongoing': { title: 'Service Ongoing', body: 'Your service is currently in progress' },
    'Completed': { title: 'Order Completed', body: 'Your order has been completed successfully' },
};

exports.sendOrderUpdateNotification = async (userId, orderId, status) => {
    try {
        const notificationData = { userId: userId, title: statusMap[status].title, body: statusMap[status].body, data: { orderId: orderId, type: 'orderUpdate' } }

        const result = await sendNotification(notificationData);

        return result;

    } catch (error) {
        console.error('Error in sendNotification:', error);
        return error;
    }
};