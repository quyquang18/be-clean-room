'ValueSensor strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("valueSensors", {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          temperature: {
            type: Sequelize.STRING,
          },
          humidity: {
            type: Sequelize.STRING,
          },
          dust25: {
            type: Sequelize.STRING,
          },
          dust10: {
            type: Sequelize.STRING,
          },
          differPressure: {
            type: Sequelize.STRING,
          },
          oxy: {
            type: Sequelize.STRING,
          },
          date: {
            type: Sequelize.BIGINT,
          },
          time: {
            type: Sequelize.BIGINT,
          },
          roomId: {
            type: Sequelize.INTEGER,
          },
          companyId: {
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
        await queryInterface.dropTable('valueSensors');
    }
};