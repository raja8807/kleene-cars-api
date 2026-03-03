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