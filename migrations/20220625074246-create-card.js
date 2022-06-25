'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => queryInterface.createTable('card_transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,

      },
      external_reference: {
        allowNull: false,
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    }),

  down: async(queryInterface, _Sequelize) => queryInterface.dropTable('card_transactions')
  
};
