const express= require('express');
function tableRoutes(tableController) {
    const router= express.Router();
    router.post('/add', tableController.addTable);
    router.get('/:id', tableController.listTables);
    router.get('/:id/search', tableController.searchTable);
    router.put('/edit/:id', tableController.editTable);
    router.delete('/delete/:id', tableController.deleteTable);
    return router;
}

module.exports=tableRoutes;