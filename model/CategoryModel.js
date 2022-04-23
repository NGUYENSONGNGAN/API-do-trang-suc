var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CategoryModel = new Schema({
  tenLoaiSanPham: {
    type: String,
    required: true,
  },
  thongTinLoaiSanPham: {
    type: String,
    default: "",
  },
  create_at: {
    type: Date,
    default: Date.now,
  },
});

CategoryModel.path("tenLoaiSanPham").set((inputString) => {
  return inputString[0].toUpperCase() + inputString.slice(1).toLowerCase();
});
module.exports = mongoose.model("Category", CategoryModel);
