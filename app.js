const express = require("express");
const db = require("./db");
const YAML = require("yamljs");
const path = require("path");
const errorHandler = require("./middleware/errorHandler");
//user
const { userRepo } = require("./repositories/userRepository");
const { userService } = require("./services/userService");
const { userController } = require("./controllers/userController");

//cafe
const { cafeRepository } = require("./repositories/cafeRepository");
const { cafeService } = require("./services/cafeService");
const { cafeController } = require("./controllers/cafeController");
//menu
const { menuRepository } = require("./repositories/menuRepository");
const { menuService } = require("./services/menuService");
const { menuController } = require("./controllers/menuController");
//tables
const { tableRepository } = require("./repositories/tableRepository");
const { tableService } = require("./services/tableService");
const { tableController } = require("./controllers/tableController");
//order
const { orderRepository } = require("./repositories/orderRepository");
const { orderService } = require("./services/orderService");
const { orderController } = require("./controllers/orderController");
//reserve
const { reserveRepository } = require("./repositories/reserveRepository");
const { reserveService } = require("./services/reserveService");
const { reserveController } = require("./controllers/reserveController");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));
//user DI
const userRepository = userRepo(db);
const userServices = userService(userRepository);
const userControllers = userController(userServices);
//cafe DI
const cafeRepo = cafeRepository(db);
const cafeServices = cafeService(cafeRepo);
const cafeControllers = cafeController(cafeServices);
//menu DI
const menuRepo = menuRepository(db);
const menuServices = menuService(menuRepo);
const menuControllers = menuController(menuServices);
//tables DI
const tableRepo = tableRepository(db);
const tableServices = tableService(tableRepo);
const tableControllers = tableController(tableServices);
//order DI
const orderRepo = orderRepository(db);
const orderServices = orderService(orderRepo);
const orderControllers = orderController(orderServices);
//reserve DI
const reserveRepo = reserveRepository(db);
const reserveServices = reserveService(reserveRepo);
const reserveControllers = reserveController(reserveServices);

const controllers = {
  userControllers,
  cafeControllers,
  menuControllers,
  tableControllers,
  orderControllers,
  reserveControllers,
};

const indexRoutes = require("./routes/index");
app.use("/api", indexRoutes(controllers));
//swagger
const swaggerUi = require("swagger-ui-express");
const userDocs = YAML.load(path.join(__dirname, "./docs/user.yaml"));
const cafeDocs = YAML.load(path.join(__dirname, "./docs/cafe.yaml"));
const menuDocs = YAML.load(path.join(__dirname, "./docs/menu.yaml"));
const orderDocs = YAML.load(path.join(__dirname, "./docs/order.yaml"));
const reserveDocs = YAML.load(path.join(__dirname, "./docs/reserve.yaml"));
const tableDocs = YAML.load(path.join(__dirname, "./docs/table.yaml"));
const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "My API",
    version: "1.0.0",
  },
  paths: {
    ...userDocs.paths,
    ...cafeDocs.paths,
    ...menuDocs.paths,
    ...orderDocs.paths,
    ...reserveDocs.paths,
    ...tableDocs.paths,
  },
};
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(errorHandler);
module.exports = app;
