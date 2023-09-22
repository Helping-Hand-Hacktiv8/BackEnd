'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.UserActivity)
      User.hasMany(models.UserReward)
    }
  }
  User.init({
    name: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{
          msg:'Please fill in all the blank'
        },
        notEmpty:{
          msg:'Please fill in all the blank'
        }
      }
     

    },
    email: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{
          msg:'Please fill in all the blank'
        },
        notEmpty:{
          msg:'Please fill in all the blank'
        },
        isEmail:{
          msg:'Email input is invalid'
        }
      },
      unique:{
        msg:'Email has been registered'
      }
    },
    password: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{
          msg:'Please fill in all the blank'
        },
        notEmpty:{
          msg:'Please fill in all the blank'
        }
      }
    },
    profileImg: {
      type:DataTypes.STRING,
    },
    token: {
      type:DataTypes.INTEGER,
    },
    phoneNumber: {
      type:DataTypes.STRING,
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: (instances, options) => {
        instances.password = hashPassword(instances.password)
      }
    }
  });
  return User;
};