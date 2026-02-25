const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const OrderEvidence = sequelize.define('OrderEvidence', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        order_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'orders',
                key: 'id'
            }
        },
        image_url: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        evidence_type: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [['before', 'after']]
            }
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: true
        }
    }, {
        tableName: 'order_evidence',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });

    return OrderEvidence;
};
