function menuController(menuService) {
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

    const deleteMenu = async function(req, res) {
      try {
        const id = req.params.id;
        const result = await menuService.deleteMenu(id);
        return res.status(200).json({ message: result });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }

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
  