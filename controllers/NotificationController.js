const { User, Worker } = require('../models');

// Helper to get Expo client lazily due to ESM require issues
let expo;
async function getExpoClient() {
    if (!expo) {
        const { Expo } = await import('expo-server-sdk');
        expo = new Expo();
    }
    return expo;
}

exports.sendNotification = async (req) => {
    try {
        const { userId, title, body, data } = req;

        if (!userId) {
            return { message: 'User ID is required' };
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return { message: 'User not found' };
        }

        // Check if user has a push token
        // For dummy testing, we allow empty token but return a specific message
        const pushToken = user.push_token;

        if (!pushToken) {
            console.log(`Notification simulation for user ${userId}: ${title} - ${body}`);
            return {
                message: 'Notification simulation successful. No push token found for user.',
                simulated: true
            };
        }

        // Check that all your push tokens appear to be valid Expo push tokens
        const { Expo: ExpoClass } = await import('expo-server-sdk');
        if (!ExpoClass.isExpoPushToken(pushToken)) {
            return res.status(400).json({ message: `Push token ${pushToken} is not a valid Expo push token` });
        }

        // Construct the message
        let messages = [{
            to: pushToken,
            sound: 'default',
            title: title || 'Kleene Cars',
            body: body || 'You have a new notification',
            data: data || {},
        }];

        // Send the notification
        const expoClient = await getExpoClient();
        let chunks = expoClient.chunkPushNotifications(messages);
        let tickets = [];

        for (let chunk of chunks) {
            try {
                let ticketChunk = await expoClient.sendPushNotificationsAsync(chunk);
                tickets.push(...ticketChunk);
            } catch (error) {
                console.error('Error sending notification chunk:', error);
            }
        }

        console.log(tickets);
        return tickets;

    } catch (error) {
        console.error('Error in sendNotification:', error);
        return error;
    }
};


exports.sendNotificationToWorker = async (req) => {
    try {
        const { workerId, title, body, data } = req;

        if (!workerId) {
            return { message: 'Worker ID is required' };
        }

        const worker = await Worker.findByPk(workerId);
        if (!worker) {
            return { message: 'Worker not found' };
        }

        // Check if user has a push token
        // For dummy testing, we allow empty token but return a specific message
        const pushToken = worker.push_token;

        if (!pushToken) {
            console.log(`Notification simulation for worker ${workerId}: ${title} - ${body}`);
            return {
                message: 'Notification simulation successful. No push token found for worker.',
                simulated: true
            };
        }

        // Check that all your push tokens appear to be valid Expo push tokens
        const { Expo: ExpoClass } = await import('expo-server-sdk');
        if (!ExpoClass.isExpoPushToken(pushToken)) {
            return res.status(400).json({ message: `Push token ${pushToken} is not a valid Expo push token` });
        }

        // Construct the message
        let messages = [{
            to: pushToken,
            sound: 'default',
            title: title || 'Kleene Cars',
            body: body || 'You have a new notification',
            data: data || {},
        }];

        // Send the notification
        const expoClient = await getExpoClient();
        let chunks = expoClient.chunkPushNotifications(messages);
        let tickets = [];

        for (let chunk of chunks) {
            try {
                let ticketChunk = await expoClient.sendPushNotificationsAsync(chunk);
                tickets.push(...ticketChunk);
            } catch (error) {
                console.error('Error sending notification chunk:', error);
            }
        }

        return tickets;

    } catch (error) {
        console.error('Error in sendNotification:', error);
        return error;
    }
};

exports.updatePushToken = async (req, res) => {
    try {
        const { pushToken } = req.body;
        const userId = req.user.id; // From authMiddleware

        if (!pushToken) {
            return res.status(400).json({ message: 'Push token is required' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.update({ push_token: pushToken });

        res.status(200).json({
            message: 'Push token updated successfully'
        });

    } catch (error) {
        console.error('Error in updatePushToken:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
