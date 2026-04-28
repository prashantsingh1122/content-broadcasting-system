const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('principal', 'teacher'),
    allowNull: false
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// Hash password before saving
User.beforeCreate(async (user) => {
  user.password_hash = await bcrypt.hash(user.password_hash, 10);
});

// Method to compare password
User.prototype.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password_hash);
};

module.exports = User;