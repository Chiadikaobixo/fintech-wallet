module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.changeColumn('transactions', 'purpose',{
        type: Sequelize.ENUM('deposit', 'transfer', 'reversal', 'card_funding'),
        allowNull: true
    }),

  down: async (queryInterface, Sequelize) => queryInterface.changeColumn('transactions', 'purpose', {
        type: Sequelize.ENUM('deposit', 'transfer', 'reversal'),
        allowNull: false
    })
};
