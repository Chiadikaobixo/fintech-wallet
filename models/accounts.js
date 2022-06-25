const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Account extends Model {
        static associate(models) {
            Account.belongsTo(models.users)
            Account.hasMany(models.transactions)
        }
    }

    Account.init({
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
        },
        balance: {
            type: DataTypes.DECIMAL(20, 4).UNSIGNED,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        }
    }, {
        sequelize,
        modelName: 'accounts',
        underscored: true,
        timestamps: false
    });
    return Account;
};