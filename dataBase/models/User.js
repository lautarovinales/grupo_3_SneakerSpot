const bcrypt = require('bcrypt');

module.exports = (sequelize, dataTypes) => {
    let alias = 'User';

    let cols = {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: dataTypes.STRING(100),
            allowNull: false,
        },
        email: {
            type: dataTypes.STRING(255),
            allowNull: false,
            unique: true, // Asegura la unicidad
            validate: {
                isEmail: true, // Valida el formato del correo electrónico
            },
        },
        password: {
            type: dataTypes.STRING(255),
            allowNull: false,
        },
        img: {
            type: dataTypes.STRING(255),
        },
        type: {
            type: dataTypes.STRING(20),
            allowNull: false,
        },
    };

    let config = {
        tableName: 'users',
        timestamps: false,
    };

    const User = sequelize.define(alias, cols, config);

    return User;
};
