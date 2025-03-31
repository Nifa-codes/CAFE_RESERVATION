const express = require('express');
const upload= require('../middleware/upload');
function userRoutes(userCrudController) {
    const router = express.Router();
    router.post('/add', userCrudController.addUser);
    router.post('/upload-avatar/:id',(req,res)=>{
        console.log('Received upload request');
        upload.single('avatar')(req,res,(err)=>{
            if(err) {
                return res.status(400).json({message: err.message});
            }
            console.log('Multer processed the file:', req.file);
            userCrudController.uploadAvatar(req,res);
        });
    });
    router.put('/edit/:id', userCrudController.editUser);
    router.get('/search', userCrudController.getUser);
    router.get('/', userCrudController.getAllUsers);
    router.delete('/delete/:id', userCrudController.deleteUser);
    return router;
}
module.exports = userRoutes;