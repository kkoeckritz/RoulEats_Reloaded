module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    user_email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    user_facebookID: DataTypes.INTEGER,
    user_created_at: DataTypes.DATE
  });

  User.associate = function(models) {
    // Associating User with Blacklist
    // When an User is deleted, also delete any associated Blacklists
    User.hasMany(models.Blacklists, {
      onDelete: "cascade"
    });
  };

  return User;
};
