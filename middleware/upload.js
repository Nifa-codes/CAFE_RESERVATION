const multer = require("multer");
const path = require("path");
const generate = require("../securities/generators");

const uploadPath = path.join(__dirname, "../uploads/avatars/");
console.log(uploadPath);
//saving options
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    cb(null, generate.generateName() + extension);
  },
});

const fileFilter = function (req, file, cb) {
  const allowedMimeTypes = ["image/jpeg", "image/png"];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error("Invalid file"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

module.exports = upload;
