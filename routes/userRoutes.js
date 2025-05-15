const express = require("express");
const upload = require("../middleware/upload");
function userRoutes(userController) {
  const router = express.Router();
  router.post("/add", userController.addUser);
  router.post(
    "/upload-avatar/:id",
    (req, res, next) => {
      console.log("Received upload request");
      upload.single("avatar")(req, res, (err) => {
        if (err) {
          return next(err);
        }

        console.log("Multer processed the file:", req.file);
        next();
      });
    },
    userController.uploadAvatar
  );
  router.put("/edit/:id", userController.editUser);
  router.get("/search", userController.getUser);
  router.get("/", userController.getAllUsers);
  router.delete("/delete/:id", userController.deleteUser);
  return router;
}
module.exports = userRoutes;
