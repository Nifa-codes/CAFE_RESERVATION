/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */
function userCrudController(userService) {
    /**
   * @swagger
   * /api/users/add:
   *   post:
   *     summary: Add a new user
   *     description: Create a new user.
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *               phone:
   *                 type: string
   *               avatar_url:
   *                 type: string
   *             required:
   *               - name
   *               - email
   *               - password
   *               - phone
   *             example:
   *               name: "John Doe"
   *               email: "john@example.com"
   *               password: "password123"
   *               phone: "09445792240"
   *               avatar_url: "/uploads/avatar/default.png"
   *     responses:
   *       201:
   *         description: User added successfully.
   *       500:
   *         description: Error adding user.
   */
const addUser= async function (req,res) {
    try
    {
        //getting avtar_url from request for now...
        const{name,email,password,phone,avatar_url} = req.body;
        const userData={name,email,password,phone,avatar_url};
        
        const response= await userService.addUser(userData);
        res.status(201).json({data:response});
    }
    catch(error)
    {
       return res.status(500).json({error:error.message});
    }
}
 /**
   * @swagger
   * /api/users/upload-avatar/{id}:
   *   post:
   *     summary: Upload a user avatar
   *     description: Upload an avatar image for a specific user.
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         description: User ID.
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               file:
   *                 type: string
   *                 format: binary
   *     responses:
   *       201:
   *         description: Avatar updated successfully.
   *       400:
   *         description: No file uploaded.
   *       500:
   *         description: Error uploading avatar.
   */
const uploadAvatar = async function (req,res) {
    try
    {
        if(!req.file)
        {
            return res.status(400).json({error:'No file uploaded'});
        }
        const avatarUrl = `/uploads/avatar/${req.file.filename}`;
        const id=req.params.id;
        const result=await userService.updateUserAvatar(id,avatarUrl);
        res.status(201).json({message:result});
    }
    catch(error)
    {
       return res.status(500).json({error:error.message});
    }
    
}
/**
   * @swagger
   * /api/users/edit/{id}:
   *   put:
   *     summary: Edit a user
   *     description: Update user details by user ID.
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         description: User ID.
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             example:
   *               name: "John Doe Updated"
   *               email: "john_updated@example.com"
   *     responses:
   *       200:
   *         description: User updated successfully.
   *       500:
   *         description: Error updating user.
   */
const editUser=async function(req,res){
    try
    {
        const id=req.params.id;
        const updatedUser=req.body;
        const result=await userService.editUser(id,updatedUser);
        res.status(200).json({message:result});
    }
    catch(error)
    {
        return res.status(500).json({error:error.message});
    }
 
}
 /**
   * @swagger
   * /api/users/delete/{id}:
   *   delete:
   *     summary: Delete a user
   *     description: Delete a user by user ID.
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         description: User ID.
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: User deleted successfully.
   *       500:
   *         description: Error deleting user.
   */
const deleteUser=async function(req,res){
    try
    {
        const id=req.params.id;
        const result=await userService.deleteUser(id);
        res.status(200).json({message:result});
    }
    catch(error)
    {
        return res.status(500).json({error:error.message});
    }
}
/**
   * @swagger
   * /api/users/search:
   *   get:
   *     summary: Search for a user
   *     description: Search users by email or name with pagination.
   *     tags: [Users]
   *     parameters:
   *       - in: query
   *         name: q
   *         description: Search query for name or email.
   *         schema:
   *           type: string
   *       - in: query
   *         name: page
   *         description: Page number.
   *         schema:
   *           type: integer
   *           default: 1
   *       - in: query
   *         name: limit
   *         description: Items per page.
   *         schema:
   *           type: integer
   *           default: 10
   *     responses:
   *       200:
   *         description: Returns a list of users matching the search query.
   *       500:
   *         description: Error fetching user details.
   */
const getUser=async function(req,res){
    try
    {
        let{page,limit}=req.query;
        page=parseInt(page);
        limit=parseInt(limit);
        if (!page || !limit) {
            page = 1;
            limit = 10;
          }
        const query= req.query.q;
        const result=await userService.getUserByEmailAndName(query,page,limit);
        res.status(200).json({page:page,
            limit:limit,
            totalCount:result.totalCount.count,
            totalPages:Math.ceil(result.totalCount/limit),
            data:result.users
            });
    }
    catch(error)
    {
        return res.status(500).json({error:error.message});
    }
}
/**
   * @swagger
   * /api/users:
   *   get:
   *     summary: Get all users
   *     description: Retrieve a paginated list of all users.
   *     tags: [Users]
   *     parameters:
   *       - in: query
   *         name: page
   *         description: Page number.
   *         schema:
   *           type: integer
   *           default: 1
   *       - in: query
   *         name: limit
   *         description: Items per page.
   *         schema:
   *           type: integer
   *           default: 10
   *     responses:
   *       200:
   *         description: List of users.
   *       500:
   *         description: Error fetching users.
   */
const getAllUsers=async function(req,res){
    try
    {
        let{page,limit}=req.query;
        page=parseInt(page);
        limit=parseInt(limit);
        if (!page || !limit) {
            page = 1;
            limit = 10;
          }
        let result=await userService.getAllUsers(page,limit);
        return res.status(200).json({page:page,
            limit:limit,
            //for frontend
            totalCount:result.totalCount.count,  
            totalPages:Math.ceil(result.totalCount/limit),
            users:result.users
        });
    }
    catch(error)
    {
        return res.status(500).json({error:error.message});
    }
}    
return{addUser,
    uploadAvatar,
    editUser,
    deleteUser,
    getUser,
    getAllUsers

};
}
module.exports={userCrudController};