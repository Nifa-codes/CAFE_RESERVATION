/**
 * @swagger
 * tags:
 *   name: Tables
 *   description: Table management for cafes
 */
function tableController(tableService){
    /**
   * @swagger
   * /api/tables/add:
   *   post:
   *     summary: Add a new table
   *     description: Add a table.
   *     tags: [Tables]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               cafe_id:
   *                 type: string
   *               table_no:
   *                 type: string
   *               capacity:
   *                 type: number
   *               is_available:
   *                 type: boolean
   *             required:
   *               - cafe_id
   *               - table_no
   *               - capacity
   *             example:
   *               cafe_id: "cafe123"
   *               table_no: "T1"
   *               capacity: 4
   *               is_available: true
   *     responses:
   *       201:
   *         description: Table added successfully.
   *       500:
   *         description: Error adding table.
   */
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
/**
   * @swagger
   * /api/tables/edit/{id}:
   *   put:
   *     summary: Update a table
   *     description: Update a table by its ID.
   *     tags: [Tables]
   *     parameters:
   *       - in: path
   *         name: id
   *         description: Table ID.
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               cafe_id:
   *                 type: string
   *               table_no:
   *                 type: string
   *               capacity:
   *                 type: number
   *               is_available:
   *                 type: boolean
   *             example:
   *               cafe_id: "cafe123"
   *               table_no: "T1"
   *               capacity: 4
   *               is_available: false
   *     responses:
   *       200:
   *         description: Table updated successfully.
   *       500:
   *         description: Error updating table.
   */
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
 /**
   * @swagger
   * /api/tables/delete/{id}:
   *   delete:
   *     summary: Delete a table
   *     description: Delete a table identified by its ID.
   *     tags: [Tables]
   *     parameters:
   *       - in: path
   *         name: id
   *         description: Table ID.
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Table deleted successfully.
   *       500:
   *         description: Error deleting table.
   */
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
 /**
   * @swagger
   * /api/tables/{id}/search:
   *   get:
   *     summary: Search tables for a cafe
   *     description: Search for tables within a specific cafe.
   *     tags: [Tables]
   *     parameters:
   *       - in: path
   *         name: id
   *         description: Cafe ID.
   *         required: true
   *         schema:
   *           type: string
   *       - in: query
   *         name: q
   *         description: Search query.
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
   *         description: Returns search results with table details.
   *       500:
   *         description: Error searching tables.
   */
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
/**
   * @swagger
   * /api/tables/{id}:
   *   get:
   *     summary: List tables for a cafe
   *     description: Retrieve a paginated list of tables for a specified cafe.
   *     tags: [Tables]
   *     parameters:
   *       - in: path
   *         name: id
   *         description: Cafe ID.
   *         required: true
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
   *         description: List of tables.
   *       500:
   *         description: Error fetching tables.
   */
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