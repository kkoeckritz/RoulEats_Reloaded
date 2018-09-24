module.exports = function(sequelize, DataTypes) {
    var Blacklist = sequelize.define("Blacklist", {
        bl_cuisine: DataTypes.STRING
    })
  
    Blacklist.associate = function(models) {
      // A Blacklist can't be created without an User due to the foreign key constraint
      Blacklist.belongsTo(models.User, {
        foreignKey: {
          allowNull: false
        }
      });
    };
  
    return Blacklist;
  };
  