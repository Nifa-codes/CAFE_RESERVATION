SELECT menu.*, cafe.name AS cafename FROM menu JOIN cafe ON menu.cafe_id=cafe.id WHERE (menu.name ILIKE $1 OR menu.category ILIKE $1) AND cafe_id = $4 ORDER BY name ASC LIMIT $2 OFFSET $3
