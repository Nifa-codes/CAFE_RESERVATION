const generate = require('../securities/generators');

function menuService(menuRepository) {
  const addMenu = async function(menuData) {
    try {
      const priceRegEx = /^\d+$/;
      if(!priceRegEx.test(menuData.price)) {
        throw new Error('Price Is not valid');
      }
      if (!menuData.name || !menuData.price) {
        throw new Error('Name and Price are required');
      }
      if(!menuData.cafe_id)
      {
        throw new Error('Cafe ID is required');
      }
      const validCafe=await menuRepository.cafeId_isValid(menuData.cafe_id);
      if(!validCafe.exists)
      {
        throw new Error('Cafe ID is invalid');
      }
      const newMenu = {
        id: generate.generateId(),
        cafe_id: menuData.cafe_id,
        name: menuData.name,
        price: menuData.price,
        category: menuData.category,
        description: menuData.description,
      };

      await menuRepository.addMenu(newMenu);
      return { message: 'Menu item added successfully' };
    } catch (error) {
      console.error(error);
      throw new Error(`Error adding menu item: ${error.message}`);
    }
  }


  const editMenu = async function(id, menuData) {
    try {
      const existingMenu = await menuRepository.menu_id_isValid(id);
      if (!existingMenu.exists) {
        throw new Error('Menu item not found');
      }
      await menuRepository.editMenu(id, menuData);
      return { message: 'Menu item updated successfully' };
    } catch (error) {
      console.error(error);
      throw new Error(`Error updating menu item:${error.message}`);
    }
  }


  const deleteMenu = async function(id) {
    try {
      const existingMenu = await menuRepository.menu_id_isValid(id);
      if (!existingMenu.exists) {
        throw new Error('Menu item not found');
      }
      await menuRepository.deleteMenu(id);
      return { message: 'Menu item deleted successfully' };
    } catch (error) {
      console.error(error);
      throw new Error('Error deleting menu item');
    }
  }

  // Search menu items by name and category
  const searchMenu = async function(queryStr,cafeId, page, limit) {
    try {
      const validCafe = await menuRepository.cafeId_isValid(cafeId);
      if(!validCafe.exists)
        {
          throw new Error('Cafe ID is invalid');
        }
      const offset = (page - 1) * limit;
      const result = await menuRepository.searchMenus(queryStr,cafeId, limit, offset);
      if (result.menus.length === 0) {
        throw new Error('No menu items found');
    }
      const cafeName= result.menus[0].cafename;
      const cleanedMenus=result.menus.map(menu=>{
        delete menu.cafename;
        return menu;
      });
      return {
        cafeName,
        menus: cleanedMenus,
        totalCount: result.totalCount,
      };
    } catch (error) {
      console.error(error);
      throw new Error(`Error searching menu items:${error.message}`);
    }
  }

  const listMenus = async function(cafeId, page, limit) {
    try {
      const validCafe = await menuRepository.cafeId_isValid(cafeId);
      if(!validCafe.exists)
        {
          throw new Error('Cafe ID is invalid');
        }
      const offset = (page - 1) * limit;
      const result = await menuRepository.listMenus(cafeId,limit, offset);
      const cafeName = result.menus[0].cafename;
      const cleanedMenus = result.menus.map(menu=> {
        delete menu.cafename;
        return menu;
      });
      return {
        menus: cleanedMenus,
        totalCount: result.totalCount,
        cafeName
      };
    } catch (error) {
      console.error(error);
      throw new Error(`Error fetching menu items:${error.message}`);
    }
  }

  return { addMenu, editMenu, deleteMenu, searchMenu, listMenus };
}

module.exports = { menuService };
