const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");

const authenticate = require("../middleware/authMiddleware");

router.get("/", authenticate, OrderController.getOrders);
router.get("/:id", authenticate, OrderController.getOrderById);

router.put("/:id", OrderController.updateOrder);

router.patch("/:id", authenticate, OrderController.updateOrder); // Support PATCH as well
router.put("/:id/assign-worker", authenticate, OrderController.assignWorker);
router.put(
  "/:id/:assignmentId/status",
  authenticate,
  OrderController.updateWorkerAssignmentStatus,
);
module.exports = router;
