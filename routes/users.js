var router = global.router;

const {
  authenticate,
  authorize,
} = require("../middlewares/Auth/VarifyTokenMiddleware");
const { apiLimitReq } = require("../middlewares/RateLimit/RateLimitMiddleware");
const {
  SignUp,
  SignIn,
  UpdateAccount,
  DeleteAccount,
} = require("../controller/UserController");



// sign up
router.post(
  "/signup",
  // apiLimitReq(
  //   15 * 60 * 1000,
  //   5,
  //   "Too many accounts created from this IP, please try again later"
  // ),
  // authenticate,
  // authorize(["admin", "superadmin"]),
  SignUp
);

// signin
router.post(
  "/signin",
  apiLimitReq(15 * 60 * 1000, 5, "Too many requests, please try again later!"),
  SignIn
);

// update account
router.put(
  "/update_user",
  apiLimitReq(15 * 60 * 1000, 5, "Too many requests, please try again later!"),
  authenticate,
  authorize(["admin", "superadmin"]),
  UpdateAccount
);

// delete account
router.delete(
  "/delete_user/:id",
  apiLimitReq(15 * 60 * 1000, 5, "Too many requests, please try again later!"),
  authenticate,
  authorize(["admin", "superadmin"]),

  DeleteAccount
);

module.exports = router;
