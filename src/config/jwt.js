module.exports = {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  
  // Token options
  options: {
    issuer: 'content-broadcast-system',
    audience: 'content-broadcast-users'
  }
};