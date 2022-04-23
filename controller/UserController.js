const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

let User = require("../model/UserModel");
const {
  limitCharacters,
} = require("../middlewares/LengthLimit/LengthLimitMiddleware");

// sign up
const SignUp = async (req, res) => {
  let { name, email, pass_word, type } = req.body;

  name && (name = name.trim());
  email && (email = email.trim());
  pass_word && (pass_word = pass_word.trim());
  type && (type = type.trim());

  if (name && email && pass_word && type) {
    if (
      limitCharacters(name.length, 100) &&
      limitCharacters(pass_word.length, 100) &&
      limitCharacters(email.length, 100) &&
      limitCharacters(type.length, 100)
    ) {
      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        res.status(400).send({
          status: "FAILED",
          message: "Email err",
        });
      } else if (pass_word.length < 3) {
        res.status(400).send({
          status: "FAILED",
          message: "Pass_word at least 3 characters",
        });
      } else {
        User.find({ email })
          .then((result) => {
            if (result.length) {
              res.status(404).send({
                status: "FAILED",
                message: "Account already exists",
              });
            } else {
              const saltRounds = 10;
              bcrypt.hash(pass_word, saltRounds).then((hashedpass_word) => {
                const newUser = new User({
                  name,
                  email,
                  pass_word: hashedpass_word,
                  type,
                });

                newUser
                  .save()
                  .then((result) => {
                    res.status(201).send({
                      status: "SUCCESS",
                      message: "Signup successful",
                      data: result,
                    });
                  })
                  .catch((err) => {
                    {
                      res.status(500).send({
                        status: "FAILED",
                        message: `An error occurred while creating an account! err: ${err}`,
                      });
                    }
                  });
              });
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send({
              status: "FAILED",
              message: "An error occurred while checking the account",
            });
          });
      }
    } else {
      res.status(400).send({
        status: "FAILED",
        message: "Character limit reached!",
      });
    }
  } else {
    res.status(400).send({
      status: "FAILED",
      message: "Error input fields",
    });
  }
};

// sign in
const SignIn = async (req, res) => {
  let { email, pass_word } = req.body;
  email && (email = email.trim());
  pass_word && (pass_word = pass_word.trim());

  if (email && pass_word) {
    if (
      limitCharacters(email.length, 100) &&
      limitCharacters(pass_word.length, 100)
    ) {
      User.find({ email })
        .then((data) => {
          if (data.length) {
            // Compare pass_word
            const hashedpass_word = data[0].pass_word;
            bcrypt
              .compare(pass_word, hashedpass_word)
              .then((result) => {
                if (result) {
                  // create token
                  const payload = {
                    id: data[0].id,
                    email: data[0].email,
                    role: data[0].type,
                  };

                  const token = jwt.sign(payload, process.env.SECRET_KEY, {
                    expiresIn: 1000 * 60 * 60 * 24 * 365,
                  });
                  res.status(200).send({
                    status: "SUCCESS",
                    message: "Signin Successful",
                    data: data,
                    token: token,
                  });
                } else {
                  res.status(404).send({
                    status: "FAILED",
                    message: "Invalid pass_word!",
                  });
                }
              })
              .catch((err) => {
                res.status(500).send({
                  status: "FAILED",
                  message:
                    "There is core happening during pass_word comparison",
                });
              });
          } else {
            res.status(500).send({
              status: "FAILED",
              message: "Invalid login information",
            });
          }
        })
        .catch((err) => {
          res.status(500).send({
            status: "FAILED",
            message: "Server 500",
          });
        });
    } else {
      res.status(400).send({
        status: "FAILED",
        message: "Character limit reached!",
      });
    }
  } else {
    res.status(400).send({
      status: "FAILED",
      message: "Error input fields",
    });
  }
};

// update account
const UpdateAccount = async (req, res) => {
  let { user_id, name, image_url, type } = req.body;

  let condition = {};

  if (user_id) {
    if (mongoose.Types.ObjectId.isValid(user_id) == true) {
      condition._id = mongoose.Types.ObjectId(user_id);
    } else {
      return res.status(404).send({
        status: "FAILED",
        data: {},
        message: `Cannot found id`,
      });
    }
  }

  let newValues = {};

  if (name && name.length > 2 && name.length < 100) {
    newValues.name = name;
  }

  // Update Images
  if (image_url && image_url.length > 2 && image_url.length < 100) {
    newValues.image_url = image_url;
  }

  // update len admin
  if (type && type.length > 2 && type.length < 100) {
    newValues.type = type;
  }

  const options = {
    new: true,
    multi: true,
  };

  await User.findOneAndUpdate(
    condition,
    { $set: newValues },
    options,
    (err, updateUser) => {
      if (err) {
        res.status(500).send({
          status: "FAILED",
          data: {},
          message: `Cannot update:`,
        });
      } else {
        if (updateUser) {
          res.status(200).send({
            status: "SUCCESS",
            data: updateUser,
            message: `Update account successfully`,
          });
        } else {
          res.status(404).send({
            status: "FAILED",
            data: updateUser,
            message: `Id not found`,
          });
        }
      }
    }
  );
};

// delete account
const DeleteAccount = async (req, res) => {
  if (
    req.params &&
    req.params.id &&
    limitCharacters(req.params.id.length, 100)
  ) {
    try {
      const user = await User.findById(req.params.id);
      await user.remove();
      res
        .status(200)
        .send({ status: "SUCCESS", message: `Delete account successfully` });
    } catch {
      res
        .status(404)
        .send({ status: "FAILED", message: `Cannot found id account` });
    }
  } else {
    res.status(400).send({
      status: "FAILED",
      message: "Character limit reached!",
    });
  }
};

module.exports = {
  SignUp,
  SignIn,
  UpdateAccount,
  DeleteAccount,
};
