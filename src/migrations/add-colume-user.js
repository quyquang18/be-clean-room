module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      (queryInterface.addColumn("Users", "gender", {
        type: Sequelize.STRING,
        after: "phonenumber",
      }),
      queryInterface.addColumn("Users", "image", {
        type: Sequelize.BLOB("long"),
        after: "username",
      })),
    ]);
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([(queryInterface.removeColumn("Users", "gender"), queryInterface.addColumn("Users", "image"))]);
  },
};
