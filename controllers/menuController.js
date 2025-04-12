/**
 * @swagger
 * tags:
 *   name: Menus
 *   description: Menu management for cafes
 */
function menuController(menuService) {
  /**
   * @swagger
   * /api/menus/add:
   *   post:
   *     summary: Add a new menu item
   *     description: Add a menu item.
   *     tags: [Menus]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               cafe_id:
   *                 type: string
   *               name:
   *                 type: string
   *               price:
   *                 type: number
   *               category:
   *                 type: string
   *               description:
   *                 type: string
   *             required:
   *               - cafe_id
   *               - name
   *               - price
   *             example:
   *               cafe_id: "cafe123"
   *               name: "Espresso"
   *               price: 70000
   *               category: "Drinks"
   *               description: "espresso"
   *     responses:
   *       201:
   *         description: Menu item added successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Menu item added successfully"
   *       500:
   *         description: Error adding menu item.
   */
    const addMenu = async function(req, res) {
      try {
        const { cafe_id, name, price, category, description } = req.body;
        const menuData = { cafe_id, name, price, category, description };
        const result = await menuService.addMenu(menuData);
        return res.status(201).json({ result });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }
    /**
   * @swagger
   * /api/menus/edit/{id}:
   *   put:
   *     summary: Update a menu item
   *     description: Edit a menu item's details by its ID.
   *     tags: [Menus]
   *     parameters:
   *       - in: path
   *         name: id
   *         description: Menu item ID.
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
   *               name:
   *                 type: string
   *               price:
   *                 type: number
   *               category:
   *                 type: string
   *               description:
   *                 type: string
   *             example:
   *               cafe_id: "cafe123"
   *               name: "Espresso Updated"
   *               price: 3.0
   *               category: "Drinks"
   *               description: "Updated description"
   *     responses:
   *       200:
   *         description: Menu item updated successfully.
   *       500:
   *         description: Error updating menu item.
   */
    const editMenu = async function(req, res) {
      try {
        const id = req.params.id;
        const { cafe_id, name, price, category, description } = req.body;
        const menuData = { cafe_id, name, price, category, description };
        const result = await menuService.editMenu(id, menuData);
        return res.status(200).json({ message: result });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }
  /**
   * @swagger
   * /api/menus/delete/{id}:
   *   delete:
   *     summary: Delete a menu item
   *     description: Delete a menu item by its ID.
   *     tags: [Menus]
   *     parameters:
   *       - in: path
   *         name: id
   *         description: Menu item ID.
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Menu item deleted successfully.
   *       500:
   *         description: Error deleting menu item.
   */
    const deleteMenu = async function(req, res) {
      try {
        const id = req.params.id;
        const result = await menuService.deleteMenu(id);
        return res.status(200).json({ message: result });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }
     /**
   * @swagger
   * /api/menus/{id}/search:
   *   get:
   *     summary: Search menu items for a cafe
   *     description: Search for menu items in a specified cafe by name or category.
   *     tags: [Menus]
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
   *         description: Search results with menu items.
   *       500:
   *         description: Error searching menu items.
   */

    const searchMenu = async function(req, res) {
      try {
        const query = req.query.q;
        const cafeId = req.params.id;
        let page = parseInt(req.query.page);
        let limit = parseInt(req.query.limit);
        if (!page || !limit) {
          page = 1;
          limit = 10;
        }
        const result = await menuService.searchMenu(query,cafeId, page, limit);

        return res.status(200).json({
          page: page,
          limit: limit,
          totalCount: result.totalCount.count , 
          totalPages: Math.ceil((result.totalCount.count) / limit),
          cafe_Name: result.cafeName,
          data: result.menus,
        });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }
  /**
   * @swagger
   * /api/menus/{id}:
   *   get:
   *     summary: List menu items for a cafe
   *     description: Retrieve paginated menu items for a specified cafe.
   *     tags: [Menus]
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
   *         description: List of menu items.
   *       500:
   *         description: Error fetching menu items.
   */

  const listMenusForCafe= async function(req, res) {
    try {
      const cafeId = req.params.id;
      let page = parseInt(req.query.page);
      let limit = parseInt(req.query.limit);
      if (!page || !limit) {
        page = 1;
        limit = 10;
      }
      const result = await menuService.listMenus(cafeId, page, limit);
      return res.status(200).json({
        page: page,
        limit: limit,
        totalCount: result.totalCount.count ,
        totalPages: Math.ceil((result.totalCount.count ) / limit),
        cafe_Name: result.cafeName,
        data: result.menus,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
    return { addMenu, editMenu, deleteMenu, searchMenu, listMenusForCafe };
  }
  
  module.exports = { menuController };
  