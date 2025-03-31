function userCrudController(userService) {
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