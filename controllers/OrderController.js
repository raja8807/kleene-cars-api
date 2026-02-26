const {
  Order,
  User,
  Vehicle,
  Address,
  OrderItem,
  WorkerAssignment,
  OrderEvidence,
  Worker,
} = require("../models");

const getOrders = async (req, res) => {
  try {
    const { user_id, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const where = {};
    if (user_id) {
      where.user_id = user_id;
    }

    const { count, rows: orders } = await Order.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        { model: User, attributes: ["full_name", "phone"] },
        { model: Vehicle, attributes: ["brand", "model", "number", "type"] },
        {
          model: Address,
          attributes: [
            "house",
            "street",
            "area",
            "city",
            "pincode",
            "longitude",
            "latitude",
          ],
        },
        { model: OrderItem, attributes: ["name", "price", "item_type"] },
        {
          model: WorkerAssignment,
          include: [{ model: Worker }],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    const formattedOrders = orders.map((order) => {
      const orderJson = order.toJSON();
      if (
        orderJson.WorkerAssignments &&
        orderJson.WorkerAssignments.length > 0
      ) {
        // Take the latest assignment
        orderJson.WorkerAssigned = orderJson.WorkerAssignments[0].Worker;
      }
      return orderJson;
    });

    res.status(200).json({
      data: formattedOrders,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({
      where: { id },
      include: [
        { model: User, attributes: ["full_name", "phone"] },
        { model: Vehicle, attributes: ["brand", "model", "number", "type"] },
        {
          model: Address,
          attributes: ["house", "street", "area", "city", "pincode"],
        },
        { model: OrderItem, attributes: ["name", "price", "item_type"] },
        {
          model: WorkerAssignment,
          include: [{ model: Worker }],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const orderJson = order.toJSON();
    if (orderJson.WorkerAssignments && orderJson.WorkerAssignments.length > 0) {
      // Take the latest assignment
      orderJson.WorkerAssigned = orderJson.WorkerAssignments[0].Worker;
    }

    res.status(200).json(orderJson);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, worker_id, ...otherUpdates } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Handle Worker Assignment
    if (worker_id) {
      // 1. Delete existing assignments for this order
      await WorkerAssignment.destroy({
        where: { order_id: id }
      });

      // 2. Insert into worker_assignments
      await WorkerAssignment.create({
        order_id: id,
        worker_id: worker_id,
        status: "Assigned",
      });

      // 3. Update Order Status (Always reset to 'Worker Assigned' on re-assignment)
      await order.update({
        status: "Worker Assigned",
      });

      // Fetch the updated order with inclusions to return to frontend
      const updatedOrder = await Order.findOne({
        where: { id },
        include: [
          { model: User, attributes: ["full_name", "phone"] },
          { model: Vehicle, attributes: ["brand", "model", "number", "type"] },
          {
            model: Address,
            attributes: ["house", "street", "area", "city", "pincode"],
          },
          { model: OrderItem, attributes: ["name", "price", "item_type"] },
          {
            model: WorkerAssignment,
            include: [{ model: Worker }],
          },
        ],
      });

      const orderJson = updatedOrder.toJSON();
      if (orderJson.WorkerAssignments && orderJson.WorkerAssignments.length > 0) {
        orderJson.WorkerAssigned = orderJson.WorkerAssignments[0].Worker;
      }

      return res.status(200).json(orderJson);
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
    console.error("Error updating order:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  updateOrder,
};
