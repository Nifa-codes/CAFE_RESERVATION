const express = require('express');
function cafeRoutes(cafeController) {
    const router = express.Router();
    router.post('/add', cafeController.addCafe);
    router.get('/', cafeController.listCafes);
    router.get('/search', cafeController.searchCafe);
    router.put('/edit/:id', cafeController.editCafe);
    router.delete('/delete/:id', cafeController.deleteCafe);
    return router;
 
}
module.exports=cafeRoutes;