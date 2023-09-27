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
    description: {
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
    fromDate: {
      type:DataTypes.DATE,
      allowNull:false,
      validate:{
        notNull:{
          msg:'Please fill in all the blank'
        },
        notEmpty:{
          msg:'Please fill in all the blank'
        },
        isDateGreaterThanToday(value){
          if(new Date(value) <= new Date()){
            throw new Error('From date must be above current date')
          }
        }
      }
    },
    toDate: {
      type:DataTypes.DATE,
      allowNull:false,
      validate:{
        notNull:{
          msg:'Please fill in all the blank'
        },
        notEmpty:{
          msg:'Please fill in all the blank'
        },
        isDateGreaterThanToday(value){
          if(new Date(value) <= new Date()){
            throw new Error('To date must be above current date')
          }
        }
      }
    },
    participant: {
      type:DataTypes.INTEGER,
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
    reward: {
      type:DataTypes.INTEGER,
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
    location: {
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
    coordinate:{
      type:DataTypes.GEOMETRY('POINT',0),
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
    photoAct: {
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
    status: {
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
  }, {
    sequelize,
    modelName: 'Activity',
  });
  return Activity;
};