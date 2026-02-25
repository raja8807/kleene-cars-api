const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Vehicle = sequelize.define('Vehicle', {
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
        type: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        brand: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        model: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        number: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        fuel: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        }
    }, {
        tableName: 'vehicles',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });

    return Vehicle;
};
