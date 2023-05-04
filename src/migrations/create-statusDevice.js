'ValueSensor strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("statusDevices", {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          status: {
            type: Sequelize.STRING,
          },
          date: {
            type: Sequelize.BIGINT,
          },
          stateStartTime: {
            type: Sequelize.BIGINT,
          },
          stateEndTime: {
            type: Sequelize.BIGINT,
          },
          deviceId: {
            type: Sequelize.INTEGER,
          },
          locationID: {
            type: Sequelize.INTEGER,
          },
          userId: {
            type: Sequelize.INTEGER,
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('statusDevices');
    }
};