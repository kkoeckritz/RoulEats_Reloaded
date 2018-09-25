module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: DataTypes.STRING,
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    facebook_id: DataTypes.INTEGER,
    user_created_at: DataTypes.DATE
  });

  User.associate = function(models) {
    // Associating User with Blacklist
    // When an User is deleted, also delete any associated Blacklists
    User.hasMany(models.Blacklist, {
      onDelete: "cascade"
    });
  };

  return User;
};
