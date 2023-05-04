module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.renameTable("allcodes", "Allcodes");
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.renameTable("Allcodes", "allcodes");
  },
};
