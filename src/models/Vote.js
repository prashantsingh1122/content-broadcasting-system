const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vote = sequelize.define('Vote', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  poll_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  option_index: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  voter_session: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'Votes',
  timestamps: false,
  createdAt: 'created_at'
});

module.exports = Vote;