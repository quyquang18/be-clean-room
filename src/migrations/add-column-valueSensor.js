module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      (queryInterface.addColumn("valueSensors", "oxy", Sequelize.STRING),
      queryInterface.changeColumn("valueSensors", "date", {
        type: Sequelize.STRING,
      })),
    ]);
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      (queryInterface.removeColumn("valueSensors", "oxy"),
      queryInterface.changeColumn("valueSensors", "date", {
        type: Sequelize.DATE,
      })),
    ]);
  },
};
