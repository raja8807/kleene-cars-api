const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const WorkerRating = sequelize.define('WorkerRating', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        order_id: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        worker_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        rating: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            validate: {
                min: 1,
                max: 5,
            },
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'worker_ratings',
        timestamps: false,
    });

    return WorkerRating;
};
