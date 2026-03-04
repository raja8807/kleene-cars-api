const { User } = require('../models');
const { sendNotification, sendNotificationToWorker } = require('./NotificationController');


exports.sendWorkerOrderUpdateNotification = async (workerId, orderId) => {
    try {
        const notificationData = { workerId, title: 'Order Assigned', body: 'You have been assigned to an order', data: { orderId: orderId, type: 'workerOrderUpdate' } }

        console.log(notificationData);

        const result = await sendNotificationToWorker(notificationData);

        return result;

    } catch (error) {
        console.error('Error in sendNotification:', error);
        return error;
    }
};

exports.sendWorkerRatingNotification = async (workerId, rating, orderId) => {
    try {
        const notificationData = {
            workerId,
            title: 'New Rating Received',
            body: `You have been rated ${rating} stars for order #${orderId.slice(0, 8).toUpperCase()}`,
            data: { orderId, type: 'workerRating' }
        };

        const result = await sendNotificationToWorker(notificationData);
        return result;
    } catch (error) {
        console.error('Error in sendWorkerRatingNotification:', error);
        return error;
    }
};