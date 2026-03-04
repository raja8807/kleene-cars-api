const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const PaymentItem = sequelize.define('PaymentItem', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        payment_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'payments',
                key: 'id'
            }
        },
        type: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                isIn: [['Service', 'Product', 'Additional Charge', 'Labor', 'Travel', 'Other', 'Parts', 'Others']]
            }
        },
        service_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'services',
                key: 'id'
            }
        },
        product_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'products',
                key: 'id'
            }
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        price: {
            type: DataTypes.NUMERIC,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        }
    }, {
        tableName: 'payment_items',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });

    return PaymentItem;
};
