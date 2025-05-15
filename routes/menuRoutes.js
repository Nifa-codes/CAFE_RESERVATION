const express = require("express");

function menuRoutes(menuController) {
  const router = express.Router();
  router.post("/add", menuController.addMenu);
  router.get("/:id", menuController.listMenusForCafe);
  router.get("/:id/search", menuController.searchMenu);
  router.put("/edit/:id", menuController.editMenu);
  router.delete("/delete/:id", menuController.deleteMenu);
  return router;
}

module.exports = menuRoutes;
