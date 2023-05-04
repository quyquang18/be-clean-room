module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn("Devices", "locationID", "roomId");
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn("Devices", "roomId", "locationID");
  },
};
