const jwt = require("jsonwebtoken");

// check user is logged in or not
const authenticate = (req, res, next) => {
  const token = req.header(process.env.TOKEN);
  try {
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decode; // req.user để tý bóc tách
    next();
  } catch (err) {
    res.status(401).send("You are not logged in");
  }
};

const authorize = (arrRole) => (req, res, next) => {
  const { user } = req;
  if (arrRole.findIndex((role) => user.role == role) > -1) {
    next();
  } else {
    res.status(403).send("You do not have access");
  }
};

module.exports = {
  authenticate,
  authorize,
};
