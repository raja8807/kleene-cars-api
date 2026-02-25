const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Service = sequelize.define('Service', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        category_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'categories',
                key: 'id'
            }
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        price: {
            type: DataTypes.NUMERIC,
            allowNull: false
        },
        discount_price: {
            type: DataTypes.NUMERIC,
            allowNull: true
        },
        image: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        }
    }, {
        tableName: 'services',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });

    return Service;
};
