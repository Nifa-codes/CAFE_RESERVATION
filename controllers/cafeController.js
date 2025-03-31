function cafeController(cafeService) {
    const addCafe =async function(req, res) {
        try
        {
            const{name,address,phone,oppeningHours}=req.body;
            const cafe = {name, address, phone, oppeningHours};
            const result = await cafeService.addCafe(cafe);
            return res.status(201).json({result});
        } 
        catch (error) {
            return res.status(500).json({error:error.message});
        }
    }
    const editCafe =async function(req, res) {
        try
        {
            const id=req.params.id;
            const{name,address,phone,oppeningHours}=req.body;
            const cafe = {name, address, phone, oppeningHours};
            const result=await cafeService.editCafe(id,cafe);
            return res.status(200).json({message:result});
        }
        catch(error)
        {
            return res.status(500).json({error:error.message});
        }
    }
    const deleteCafe=async function(req,res){
        try
        {
            const id=req.params.id;
            const result=await cafeService.deleteCafe(id);
            res.status(200).json({message:result});
        }
        catch(error)
        {
            return res.status(500).json({error:error.message});
        }
    }
    const searchCafe=async function(req,res){
        try
        {
            const query=req.query.q;
            let page=parseInt(req.query.page);
            let limit=parseInt(req.query.limit);
            if (!page || !limit) {
                page = 1;
                limit = 10;
              }
            const result=await cafeService.searchCafe(query,page,limit);
            return res.status(200).json({page:page,
                limit:limit,
                totalCount:result.totalCount.count,
                totalPages:Math.ceil(result.totalCount.count/limit),
                data:result.cafes});
        }
        catch(error)
        {
            return res.status(500).json({error:error.message});
        }
    }
    const listCafes=async function(req,res){
        try
        {
            let page=parseInt(req.query.page);
            let limit=parseInt(req.query.limit);
            if (!page || !limit) {
                page = 1;
                limit = 10;
              }
            const result=await cafeService.listCafes(page,limit);
            return res.status(200).json({page:page,
                limit:limit,
                totalCount:result.totalCount.count,
                totalPages:Math.ceil(result.totalCount.count/limit),
                data:result.cafes});
        }
        catch(error)
        {
            return res.status(500).json({error:error.message});
        }
    }
    return{addCafe,editCafe,searchCafe,deleteCafe,listCafes};
}
module.exports = {cafeController};