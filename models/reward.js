'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reward extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Reward.hasMany(models.UserReward)
    }
  }
  Reward.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    companyName: DataTypes.STRING,
    price: DataTypes.INTEGER,
    photoProduct: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Reward',
  });
  return Reward;
};