var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  pass_word: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "user",
  },
  create_at: {
    type: Date,
    default: Date.now,
  },
  avatar: {
    type: String,
    default: `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/300/300`
  },
});

module.exports = mongoose.model("User", UserSchema);
