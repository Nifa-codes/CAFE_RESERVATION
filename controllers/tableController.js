function tableController(tableService){
const addTable = async function(req,res){
    try{
        const{cafe_id, capacity, table_no, is_available} = req.body;
        const tableData = {cafe_id, capacity, table_no, is_available};
        const result = await tableService.addTable(tableData);
        return res.status(201).json({result});
    } 
    catch(error){
        return res.status(500).json({error: error.message});
    }
}
const editTable = async function(req,res){
    try{
        const id = req.params.id;
        const {cafe_id, capacity, table_no, is_available} = req.body;
        const tableData = {cafe_id, capacity, table_no, is_available};
        const result = await tableService.editTable(id,tableData);
        return res.status(200).json({result});
    } 
    catch(error){
        return res.status(500).json({error: error.message});
    }
}
const deleteTable = async function(req,res){
    try{
        const id = req.params.id;
        const result = await tableService.deleteTable(id);
        return res.status(200).json({result});
    } 
    catch(error){
        return res.status(500).json({error: error.message});
    }
}
const searchTable = async function(req,res){
    try{
        const cafe_id = req.params.id;
        let page = parseInt(req.query.page);
        let limit = parseInt(req.query.limit);
        if(!page||!limit)
        {
            page=1;
            limit=10;
        }
        const query = req.query.q;
        const result = await tableService.searchTable(cafe_id,query,page,limit);
        return res.status(200).json({
            page:result.page,
            limit:result.limit,
            totalCount:result.totalCount.count,
            totalPages:Math.ceil(result.totalCount.count/limit),
            cafe_name:result.cafeName,
            data: result.tables
        });
    } 
    catch(error){
        return res.status(500).json({error: error.message});
    }
}
const listTables = async function(req,res){
    try{
        let page = parseInt(req.query.page);
        let limit = parseInt(req.query.limit);
        if(!page||!limit)
        {
            page=1;
            limit=10;
        }
        const cafe_id = req.params.id;
        const result = await tableService.listTables(cafe_id,page,limit);
        return res.status(200).json({
            page:result.page,
            limit:result.limit,
            totalCount:result.totalCount.count,
            totalPages:Math.ceil(result.totalCount.count/limit),
            cafe_name:result.cafeName,
            data: result.tables
        });
    }
    catch(error){
        return res.status(500).json({error: error.message});
    }
}
return {addTable,editTable,deleteTable,searchTable,listTables};
}
module.exports = {tableController};