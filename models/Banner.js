const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Banner = sequelize.define('Banner', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        image: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        }
    }, {
        tableName: 'banners',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });

    return Banner;
};
