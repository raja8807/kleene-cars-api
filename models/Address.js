const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Address = sequelize.define('Address', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        label: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        house: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        street: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        area: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        city: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        pincode: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        latitude: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        longitude: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        }
    }, {
        tableName: 'addresses',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });

    return Address;
};
