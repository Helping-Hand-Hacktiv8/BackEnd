'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserReward extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserReward.belongsTo(models.User)
      UserReward.belongsTo(models.Reward)
    }
  }
  UserReward.init({
    UserId: DataTypes.INTEGER,
    RewardId: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'UserReward',
  });
  return UserReward;
};