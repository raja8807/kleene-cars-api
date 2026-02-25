const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const WorkerAssignment = sequelize.define('WorkerAssignment', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        order_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'orders',
                key: 'id'
            }
        },
        worker_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'workers',
                key: 'id'
            }
        },
        assigned_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: true
        },
        status: {
            type: DataTypes.TEXT,
            defaultValue: 'Assigned',
            allowNull: true
        }
    }, {
        tableName: 'worker_assignments',
        timestamps: false, // Since it uses 'assigned_at' manually
    });

    return WorkerAssignment;
};
