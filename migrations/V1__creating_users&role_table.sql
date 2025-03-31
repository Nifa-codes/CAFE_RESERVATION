--has int id
CREATE TABLE roles(
id SERIAL PRIMARY KEY,
role_name VARCHAR(255) NOT NULL
);
-- has uuid
CREATE TABLE users(
    id UUID PRIMARY KEY,
    role_id INT NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
-- remember to add +98 after the phone number
    phone VARCHAR(14),
    avatar_url VARCHAR(225),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_role_id FOREIGN KEY(role_id) REFERENCES roles(id)
);
-- migrated successfully 