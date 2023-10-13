module.exports = (sequelize, dataTypes) => {
    let alias = 'Product';
    
    let cols = {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: dataTypes.STRING(100),
            allowNull: false,
        },
        price: {
            type: dataTypes.INTEGER,
            allowNull: false,
        },
        discount: {
            type: dataTypes.INTEGER,
        },
        description: {
            type: dataTypes.STRING(255),
            allowNull: false,
        },
        enOferta: {
            type: dataTypes.tinyInteger,
            allowNull: false,
        },
        img: {
            type: dataTypes.STRING(255),
            allowNull: false,
        },
        img2: {
            type: dataTypes.STRING(255),
        },
        img3: {
            type: dataTypes.STRING(255),
        },
        class: {
            type: dataTypes.STRING(45),
            allowNull: false,
        },
        sex: {
            type: dataTypes.tinyInteger,
        },
    };

    let config = {
        tableName: 'products',
        timestamps: false,
    };

    const Product = sequelize.define(alias, cols, config);

    Product.associate = function (models) {
        Product.belongsToMany(models.Size, {
            as: 'sizes',
            through: 'sizes_has_products',
            foreignKey: 'product_id',
            otherKey: 'size_id',
            timestamps: false
        });
    }

    return Product;
}