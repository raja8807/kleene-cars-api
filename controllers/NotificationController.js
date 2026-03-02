const { Expo } = require('expo-server-sdk');
const { User } = require('../models');

// Create a new Expo SDK client
let expo = new Expo();

exports.sendNotification = async (req, res) => {
    try {
        const { userId, title, body, data } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user has a push token
        // For dummy testing, we allow empty token but return a specific message
        const pushToken = user.push_token;

        if (!pushToken) {
            console.log(`Notification simulation for user ${userId}: ${title} - ${body}`);
            return res.status(200).json({
                message: 'Notification simulation successful. No push token found for user.',
                simulated: true
            });
        }

        // Check that all your push tokens appear to be valid Expo push tokens
        if (!Expo.isExpoPushToken(pushToken)) {
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
        let chunks = expo.chunkPushNotifications(messages);
        let tickets = [];

        for (let chunk of chunks) {
            try {
                let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                tickets.push(...ticketChunk);
            } catch (error) {
                console.error('Error sending notification chunk:', error);
            }
        }

        res.status(200).json({
            message: 'Notification sent successfully',
            tickets
        });

    } catch (error) {
        console.error('Error in sendNotification:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
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
