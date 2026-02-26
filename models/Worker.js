const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Worker = sequelize.define('Worker', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        worker_id: {
            type: DataTypes.TEXT,
            allowNull: true,
            unique: true
        },
        auth_user_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'auth.users', // Note: This might need adjustment based on how Sequelize handles cross-schema references, but usually 'users' if in same DB context or just UUID.
                key: 'id'
            }
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        email: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        phone: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        experience: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        rating: {
            type: DataTypes.NUMERIC,
            defaultValue: 0,
            allowNull: true
        },
        status: {
            type: DataTypes.TEXT,
            defaultValue: 'Active',
            allowNull: true
        },
        assigned_orders_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: true
        },
        latitude: {
            type: DataTypes.NUMERIC,
            allowNull: true
        },
        longitude: {
            type: DataTypes.NUMERIC,
            allowNull: true
        },
        id_proof_url: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'workers',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });

    return Worker;
};
