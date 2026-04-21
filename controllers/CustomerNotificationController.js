const { User } = require("../models");
const { sendNotification } = require("./NotificationController");
const { getSupabaseAdmin } = require("../config/supabase");

const statusMap = {
  Booked: {
    title: "Order Booked",
    body: "Your order has been booked successfully",
  },
  Confirmed: {
    title: "Order Confirmed",
    body: "Your order has been confirmed",
  },
  "Worker Assigned": {
    title: "Worker Assigned",
    body: "A worker has been assigned to your order",
  },
  "Worker Reached Location": {
    title: "Worker Reached Location",
    body: "Your worker has reached the location",
  },
  "Service Ongoing": {
    title: "Service Ongoing",
    body: "Your service is currently in progress",
  },
  Completed: {
    title: "Order Completed",
    body: "Your order has been completed successfully",
  },
  "Payment Received": {
    title: "Payment Received",
    body: "Thank you! We have received your payment for your order.",
  },
};

exports.sendOrderUpdateNotification = async (userId, orderId, status) => {
  try {
    const notificationData = {
      userId: userId,
      title: statusMap[status].title,
      body: statusMap[status].body,
      data: { orderId: orderId, type: "orderUpdate" },
    };

    const result = await sendNotification({
      body: {
        ...notificationData,
      },
    });

    try {
      const supabase = getSupabaseAdmin();
      await supabase.from("notifications").insert({
        user_id: userId,
        title: notificationData.title,
        body: notificationData.body,
        data: notificationData.data,
      });
    } catch (dbError) {
      console.error("Error saving notification to DB:", dbError);
    }

    return result;
  } catch (error) {
    console.error("Error in sendNotification:", error);
    return error;
  }
};
