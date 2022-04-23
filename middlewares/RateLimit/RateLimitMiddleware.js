const rateLimit = require("express-rate-limit");

const apiLimitReq = (time, max_req, message) => {
  const apiLimitReq = rateLimit({
    windowMs: time,
    max: max_req,
    handler: (req, res) => {
      res.status(429).send({
        status: "FAILED",
        message: message,
      });
    },
  });
  return apiLimitReq;
};

module.exports = {
  apiLimitReq,
};
