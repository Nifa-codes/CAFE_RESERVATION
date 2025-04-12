/**
 * @swagger
 * tags:
 *   name: Cafes
 *   description: Cafe management
 */
function cafeController(cafeService) {
 /**
   * @swagger
   * /api/cafes/add:
   *   post:
   *     summary: Add a new cafe
   *     description: Add a new cafe. 
   *     tags: [Cafes]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: The name of the cafe.
   *               address:
   *                 type: string
   *                 description: The cafe address.
   *               phone:
   *                 type: string
   *                 description: Must match the pattern 09*********.
   *               oppeningHours:
   *                 type: string
   *                 description: Hours of operation in HH:MM__HH:MM format.
   *             required:
   *               - name
   *               - address
   *               - phone
   *               - oppeningHours
   *             example:
   *               name: "Cafe Lotus"
   *               address: "123 Street"
   *               phone: "09445792240"
   *               oppeningHours: "10:00__23:00"
   *     responses:
   *       201:
   *         description: Cafe added successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Cafe added successfully"
   *       500:
   *         description: Error adding cafe.
   */
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
     /**
   * @swagger
   * /api/cafes/edit/{id}:
   *   put:
   *     summary: Edit an existing cafe
   *     description: Update an existing cafe's details.
   *     tags: [Cafes]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Cafe ID to update.
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               address:
   *                 type: string
   *               phone:
   *                 type: string
   *               oppeningHours:
   *                 type: string
   *             example:
   *               name: "Cafe Lotus Updated"
   *               address: "456 Avenue"
   *               phone: "09445792240"
   *               oppeningHours: "11:00__22:00"
   *     responses:
   *       200:
   *         description: Cafe updated successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Cafe updated successfully"
   *       500:
   *         description: Error updating cafe.
   */
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
    /**
   * @swagger
   * /api/cafes/delete/{id}:
   *   delete:
   *     summary: Delete a cafe
   *     description: Delete a cafe by its ID.
   *     tags: [Cafes]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Cafe ID to delete.
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Cafe deleted successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Cafe deleted successfully"
   *       500:
   *         description: Error deleting cafe.
   */
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
    /**
   * @swagger
   * /api/cafes/search:
   *   get:
   *     summary: Search for cafes
   *     description: Search cafes by a query string with pagination.
   *     tags: [Cafes]
   *     parameters:
   *       - in: query
   *         name: q
   *         description: Search query for cafe names.
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
   *         description: Number of items per page.
   *         schema:
   *           type: integer
   *           default: 10
   *     responses:
   *       200:
   *         description: Returns a list of cafes matching the search criteria.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 page:
   *                   type: integer
   *                   example: 1
   *                 limit:
   *                   type: integer
   *                   example: 10
   *                 totalCount:
   *                   type: integer
   *                   example: 30
   *                 totalPages:
   *                   type: integer
   *                   example: 3
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *     500:
   *       description: Error searching cafes.
   */
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
     /**
   * @swagger
   * /api/cafes:
   *   get:
   *     summary: List all cafes
   *     description: Retrieve a paginated list of all cafes.
   *     tags: [Cafes]
   *     parameters:
   *       - in: query
   *         name: page
   *         description: Page number.
   *         schema:
   *           type: integer
   *           default: 1
   *       - in: query
   *         name: limit
   *         description: Number of items per page.
   *         schema:
   *           type: integer
   *           default: 10
   *     responses:
   *       200:
   *         description: List of cafes.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 page:
   *                   type: integer
   *                 limit:
   *                   type: integer
   *                 totalCount:
   *                   type: integer
   *                 totalPages:
   *                   type: integer
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *       500:
   *         description: Error fetching cafes.
   */
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