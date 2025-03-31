function menuRepository(db) {
    const addMenu = async function(menu) {
      return await db.none(
        'INSERT INTO menu (id, cafe_id, name, price, category, description) VALUES ($1, $2, $3, $4, $5, $6)',
        [menu.id, menu.cafe_id, menu.name, menu.price, menu.category, menu.description]
      );
    }
  
    
    const editMenu = async function(id, menu) {
      let i = 2;
      let valuesQ = [];
      valuesQ[0] = id;
      let query = 'UPDATE menu SET id=$1';
      if (menu.cafe_id) {
        let cafeIdQ = `,cafe_id=$${i}`;
        valuesQ[i - 1] = menu.cafe_id;
        i++;
        query = query + cafeIdQ;
      }
      if (menu.name) {
        let nameQ = `,name=$${i}`;
        valuesQ[i - 1] = menu.name;
        i++;
        query = query + nameQ;
      }
      if (menu.price) {
        let priceQ = `,price=$${i}`;
        valuesQ[i - 1] = menu.price;
        i++;
        query = query + priceQ;
      }
      if (menu.category) {
        let categoryQ = `,category=$${i}`;
        valuesQ[i - 1] = menu.category;
        i++;
        query = query + categoryQ;
      }
      if (menu.description) {
        let descQ = `,description=$${i}`;
        valuesQ[i - 1] = menu.description;
        i++;
        query = query + descQ;
      }
      query = query + ' WHERE id=$1';
      return await db.none(query, valuesQ);
    }
  
  
    const deleteMenu = async function(id) {
      return await db.none('DELETE FROM menu WHERE id=$1', [id]);
    }
  
    // Search menu items by name and category for a specific cafe
    const searchMenus = async function(query, cafeId, limit, offset) {
      const menus = await db.any(
        'SELECT menu.*, cafe.name AS cafename FROM menu JOIN cafe ON menu.cafe_id=cafe.id WHERE (menu.name ILIKE $1 OR menu.category ILIKE $1) AND cafe_id = $4 LIMIT $2 OFFSET $3',
        [`%${query}%`, limit, offset, cafeId ]
      );
      const totalCount = await db.one(
        'SELECT COUNT(*) FROM menu WHERE (name ILIKE $1 OR category ILIKE $1) AND cafe_id = $2',
        [`%${query}%`,cafeId]
      );
      return { menus, totalCount };
    }
  
    
    const listMenus = async function(cafeId,limit, offset) {
      const menus = await db.any('SELECT menu.*, cafe.name AS cafeName FROM menu JOIN cafe ON menu.cafe_id = cafe.id WHERE menu.cafe_id=$3 LIMIT $1 OFFSET $2', [limit, offset,cafeId]);
      const totalCount = await db.one('SELECT COUNT(*) FROM menu WHERE cafe_id=$1', [cafeId]);
      return { menus, totalCount,};
    }
    const cafeId_isValid = async function(cafeId) {
      return await db.one('SELECT EXISTS(SELECT 1 FROM cafe WHERE id=$1)', [cafeId]);
    }
    const menu_id_isValid = async function(menuId) {
      return await db.one('SELECT EXISTS(SELECT 1 FROM menu WHERE id=$1)', [menuId]);
    }
    return { addMenu, editMenu, deleteMenu, searchMenus, listMenus, menu_id_isValid,cafeId_isValid };
  }
  
  module.exports = { menuRepository };
  