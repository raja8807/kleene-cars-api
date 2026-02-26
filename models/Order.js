const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Order = sequelize.define(
    "Order",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      order_id: {
        type: DataTypes.TEXT,
        allowNull: true,
        unique: true
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      vehicle_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "vehicles",
          key: "id",
        },
      },
      address_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "addresses",
          key: "id",
        },
      },
      total_amount: {
        type: DataTypes.NUMERIC,
        allowNull: false,
      },
      status: {
        type: DataTypes.TEXT,
        defaultValue: "Pending",
        allowNull: true,
      },
      scheduled_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      scheduled_time: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      payment_method: {
        type: DataTypes.TEXT,
        defaultValue: "COD",
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      completed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      electricity_available: {
        type: DataTypes.BOOLEAN,
        // allowNull: true,
      },
      water_available: {
        type: DataTypes.BOOLEAN,
        // allowNull: true,
      },
      additional_notes: {
        type: DataTypes.TEXT,
        // allowNull: true,
      },
    },
    {
      tableName: "orders",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    },
  );

  return Order;
};
