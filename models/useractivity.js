'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserActivity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserActivity.belongsTo(models.Activity)
      UserActivity.belongsTo(models.User)
    }
  }
  UserActivity.init({
    UserId: DataTypes.INTEGER,
    ActivityId: DataTypes.INTEGER,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'UserActivity',
  });
  return UserActivity;
};