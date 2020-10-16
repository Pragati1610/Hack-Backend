const jwt = require('jsonwebtoken');
const logger = require('../logging/logger');

const jwtAuth = (req, res, next) => {
  try {
    const token = req.get('Authorization');
    const claims = jwt.verify(token, process.env.JWT_PASS);
    req.claims = claims;
    next();
  } catch (e) {
    logger.error(e);
    return res.status(401).send(e);
  }
};

module.exports = jwtAuth;
