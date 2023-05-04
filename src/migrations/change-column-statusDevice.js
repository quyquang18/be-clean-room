module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      (queryInterface.removeColumn("statusDevices", "statusTime"),
      queryInterface.changeColumn("statusDevices", "date", {
        type: Sequelize.STRING,
      }),
      queryInterface.changeColumn("statusDevices", "stateStartTime", {
        type: Sequelize.STRING,
      }),
      queryInterface.changeColumn("statusDevices", "stateEndTime", {
        type: Sequelize.STRING,
      })),
      queryInterface.renameColumn("statusDevices", "locationID", "roomId"),
    ]);
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      (queryInterface.addColumn("statusDevices", "statusTime", Sequelize.STRING),
      queryInterface.changeColumn("statusDevices", "date", {
        type: Sequelize.DATE,
      }),
      queryInterface.changeColumn("statusDevices", "stateStartTime", {
        type: Sequelize.DATE,
      }),
      queryInterface.changeColumn("statusDevices", "v", {
        type: Sequelize.DATE,
      })),
      queryInterface.renameColumn("statusDevices", "roomId", "locationID"),
    ]);
  },
};
