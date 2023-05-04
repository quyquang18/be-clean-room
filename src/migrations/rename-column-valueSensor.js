module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([(queryInterface.renameColumn("valueSensors", "locationID", "roomId"), queryInterface.removeColumn("valueSensors", "time"))]);
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      (queryInterface.renameColumn("valueSensors", "roomId", "locationID"), queryInterface.addColumn("valueSensors", "time", Sequelize.STRING)),
    ]);
  },
};
