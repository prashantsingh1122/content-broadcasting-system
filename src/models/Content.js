const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Content = sequelize.define('Content', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  subject: {
    type: DataTypes.ENUM('maths', 'science', 'english', 'history'),
    allowNull: false
  },
  file_url: {
    type: DataTypes.STRING,
    allowNull: false
    // For S3: https://bucket.s3.region.amazonaws.com/uploads/file.jpg
  },
  file_path: {
    type: DataTypes.STRING,
    allowNull: false
    // For S3: uploads/1682345678-123456789.jpg (S3 key)
  },
  file_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  file_size: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('uploaded', 'pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  rejection_reason: {
    type: DataTypes.TEXT
  },
  start_time: {
    type: DataTypes.DATE
  },
  end_time: {
    type: DataTypes.DATE
  },
  rotation_duration: {
    type: DataTypes.INTEGER,
    defaultValue: 5
  },
  uploaded_by: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  approved_by: {
    type: DataTypes.UUID,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  approved_at: {
    type: DataTypes.DATE
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  tableName: 'Contents'
});

module.exports = Content;