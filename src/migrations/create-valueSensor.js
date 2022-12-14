'ValueSensor strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('valueSensors', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            temperature: {
                type: Sequelize.STRING
            },
            humidity: {
                type: Sequelize.STRING
            },
            dust25: {
                type: Sequelize.STRING
            },
            dust10: {
                type: Sequelize.STRING
            },
            pressIn: {
                type: Sequelize.STRING
            },
            pressOut: {
                type: Sequelize.STRING
            },
            date: {
                type: Sequelize.DATEONLY
            },
            time: {
                type: Sequelize.STRING
            },
            locationID: {
                type: Sequelize.INTEGER
            },
            userId: {
                type: Sequelize.INTEGER
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('valueSensors');
    }
};