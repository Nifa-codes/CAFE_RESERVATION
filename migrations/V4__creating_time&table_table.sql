CREATE TABLE reservation_date(
id SERIAL PRIMARY KEY,
date DATE NOT NULL,
is_available BOOLEAN DEFAULT TRUE
);

CREATE TABLE reservation_time(
id SERIAL PRIMARY KEY,
time_start TIME NOT NULL,
time_end TIME NOT NULL,
is_available BOOLEAN DEFAULT TRUE
);

ALTER TABLE reservation
    ADD COLUMN reservation_date_id INT,
    ADD CONSTRAINT fk_reservation_date_id FOREIGN KEY (reservation_date_id) REFERENCES reservation_date(id),
    ADD COLUMN reservation_time_id INT,
    ADD CONSTRAINT fk_reservation_time_id FOREIGN KEY(reservation_time_id) REFERENCES reservation_time(id),
    DROP COLUMN reserve_time

