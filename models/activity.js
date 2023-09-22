'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Activity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Activity.hasMany(models.UserActivity)
    }
  }
  Activity.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    fromDate: DataTypes.DATE,
    toDate: DataTypes.DATE,
    participant: DataTypes.INTEGER,
    reward: DataTypes.INTEGER,
    location: DataTypes.STRING,
    lat: DataTypes.FLOAT,
    lon: DataTypes.FLOAT,
    photoAct: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Activity',
  });
  return Activity;
};