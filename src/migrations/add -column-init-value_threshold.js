module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn("Threshold_values", "init", Sequelize.STRING);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn("Threshold_values", "init");
  },
};
