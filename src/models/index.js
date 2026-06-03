const User = require('./User');
const Content = require('./Content');
const Poll = require('./Poll');
const Vote = require('./Vote');

// Existing associations
User.hasMany(Content, { foreignKey: 'uploaded_by', as: 'contents' });
Content.belongsTo(User, { foreignKey: 'uploaded_by', as: 'teacher' });
Content.belongsTo(User, { foreignKey: 'approved_by', as: 'approver' });

// Poll associations
User.hasMany(Poll, { foreignKey: 'teacher_id', as: 'polls' });
Poll.belongsTo(User, { foreignKey: 'teacher_id', as: 'teacher' });
Poll.hasMany(Vote, { foreignKey: 'poll_id', as: 'votes' });
Vote.belongsTo(Poll, { foreignKey: 'poll_id', as: 'poll' });

module.exports = { User, Content, Poll, Vote };