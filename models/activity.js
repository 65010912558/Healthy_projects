const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./user');

const HealthRecord = sequelize.define('activity', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id',
    },
    allowNull: false,
  },
  weight: DataTypes.DECIMAL,
  height: DataTypes.DECIMAL,
  blood_pressure: DataTypes.STRING,
  created_at: DataTypes.DATE,
});

module.exports = activity;
