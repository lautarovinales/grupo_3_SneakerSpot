module.exports = (sequelize, dataTypes) => {
    let alias = 'Size';

    let cols = {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        size: {
            type: dataTypes.STRING(20),
            allowNull: false,
        },
    };

    let config = {
        tableName: 'sizes',
        timestamps: false,
    };

    const Size = sequelize.define(alias, cols, config);

    Size.associate = function (models) {
        Size.belongsToMany(models.Product, {
            as: 'products',
            through: 'sizes_has_products',
            foreignKey: 'size_id',
            otherKey: 'product_id',
            timestamps: false
        });
    }

    return Size;
}