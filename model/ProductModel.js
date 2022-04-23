var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
  tenSanPham: { 
    type: String,
    required: true,
  },
  mauSac: {
    type: String,
    required: true,
  },
  kichThuoc: {
    type: String,
    default: "",
  },
  thongTinSanPham: {
    type: String,
    default: "",
  },
  chatLieu: {
    type: String,
    required: true,
  },
  maLoaiSanPham: { type: Schema.ObjectId, ref: "Category" },
  luotXem: {
    type: Number,
    default: 1,
    min: 1,
  },
  highlight: {
    type: Boolean,
    default: false,
  },
  create_at: {
    type: Date,
    default: Date.now,
  },
  danhSachHinhAnh: []
});

// a setter
ProductSchema.path("tenSanPham").set((inputString) => {
  return inputString[0].toUpperCase() + inputString.slice(1);
});

module.exports = mongoose.model("Product", ProductSchema);