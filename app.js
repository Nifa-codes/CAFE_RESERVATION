const express=require('express');
const db = require('./db');
//user
const {userRepo}=require('./repositories/userRepository');
const {userCrudService}=require('./services/userService');
const {userCrudController}=require('./controllers/userController');

//cafe
const {cafeRepository}=require('./repositories/cafeRepository');
const {cafeService}=require('./services/cafeService');
const {cafeController}=require('./controllers/cafeController');
//menu
const {menuRepository}=require('./repositories/menuRepository');
const {menuService}=require('./services/menuService');
const {menuController}=require('./controllers/menuController');
//tables
const {tableRepository}=require('./repositories/tableRepository');
const {tableService}=require('./services/tableService');
const {tableController}=require('./controllers/tableController');
//order
const {orderRepository}=require('./repositories/orderRepository');
const {orderService}=require('./services/orderService');
const {orderController}=require('./controllers/orderController');
//reserve
const {reserveRepository}=require('./repositories/reserveRepository');
const {reserveService}=require('./services/reserveService');
const {reserveController}=require('./controllers/reserveController');

const app=express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));
//user DI
const userRepository=userRepo(db);
const userService=userCrudService(userRepository);
const userController=userCrudController(userService);
//cafe DI
const cafeRepo=cafeRepository(db);
const cafeServices=cafeService(cafeRepo);
const cafeControllers=cafeController(cafeServices);
//menu DI
const menuRepo=menuRepository(db);
const menuServices=menuService(menuRepo);  
const menuControllers=menuController(menuServices);
//tables DI
const tableRepo=tableRepository(db);
const tableServices=tableService(tableRepo);
const tableControllers=tableController(tableServices);
//order DI
const orderRepo=orderRepository(db);
const orderServices=orderService(orderRepo);
const orderControllers=orderController(orderServices);
//reserve DI
const reserveRepo=reserveRepository(db);
const reserveServices=reserveService(reserveRepo);
const reserveControllers=reserveController(reserveServices);

const controllers = {
    userController,
    cafeControllers,
    menuControllers,
    tableControllers,
    orderControllers,
    reserveControllers
};

const indexRoutes = require('./routes/index');
app.use('/api', indexRoutes(controllers));
//swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


module.exports=app;