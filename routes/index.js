const express = require('express');

const userRoutes = require('./userRoutes');
const cafeRoutes = require('./cafeRoutes');
const menuRoutes = require('./menuRoutes');
const tableRoutes = require('./tableRoutes');
const orderRoutes = require('./orderRoutes');
const reserveRoutes = require('./reserveRoutes');
function indexRoutes(controllers)
{
    const router = express.Router();
    router.use('/users', userRoutes(controllers.userController));
    router.use('/cafes', cafeRoutes(controllers.cafeControllers));
    router.use('/menus', menuRoutes(controllers.menuControllers));
    router.use('/tables', tableRoutes(controllers.tableControllers));
    router.use('/orders', orderRoutes(controllers.orderControllers));
    router.use('/reserves', reserveRoutes(controllers.reserveControllers));
    return router;
}

module.exports= indexRoutes;