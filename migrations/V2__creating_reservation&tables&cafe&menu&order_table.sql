-- changed the schema here(cafe,menu,reserve)
--deleted menu_id from cafe
CREATE TABLE cafe(
    id UUID PRIMARY KEY,
    menu_id UUID,
    name VARCHAR(225),
    address VARCHAR(225),
    contact_number VARCHAR(225),
    oppening_hours VARCHAR(225),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);
CREATE TABLE menu(
    id UUID PRIMARY KEY,
    cafe_id UUID,
    name VARCHAR(225),
    price VARCHAR(225),
    category VARCHAR(225),
    description TEXT,
    CONSTRAINT fk_menu_cafe_id FOREIGN KEY (cafe_id) REFERENCES cafe(id)
);

CREATE TABLE tables(
    id UUID PRIMARY KEY,
    cafe_id UUID,
    table_no INT,
    capacity INT,
    is_available BOOLEAN,
    CONSTRAINT fk_tables_cafe_id FOREIGN KEY (cafe_id) REFERENCES cafe(id)
);

CREATE TABLE orders(
    id UUID PRIMARY KEY,
    items TEXT,
    status VARCHAR(225),
    total_price VARCHAR(225),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE reservation(
    id UUID PRIMARY KEY,
    cafe_id UUID,
    users_id UUID,
    tables_id UUID,
    orders_id UUID,
    reserve_time TIMESTAMP,
    status VARCHAR(225),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reservation_cafe_id FOREIGN KEY (cafe_id) REFERENCES cafe(id),
    CONSTRAINT fk_reservation_users_id FOREIGN KEY (users_id) REFERENCES users(id),
    CONSTRAINT fk_reservation_tables_id FOREIGN KEY (tables_id) REFERENCES tables(id),
    CONSTRAINT fk_reservation_orders_id FOREIGN KEY (orders_id) REFERENCES orders(id)
);

--migrated successfully


