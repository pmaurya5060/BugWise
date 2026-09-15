const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'super_secret_jwt_key_change_in_production_12345',
    {
      expiresIn: '30d'
    }
  );
};

module.exports = generateToken;
