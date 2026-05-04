SELECT PostGIS_Version();


-- Users' table
CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	email VARCHAR(30) UNIQUE NOT NULL,
	password_hash VARCHAR(30) NOT NULL,
	role VARCHAR(12) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP
);


-- Location's table
CREATE TABLE IF NOT EXISTS locations(
	id SERIAL PRIMARY KEY,
	latitude DECIMAL(9, 6) NOT NULL,
	longitude DECIMAL(9, 5) NOT NULL,
	city TEXT,
	country TEXT,
	coordinates GEOGRAPHY,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP
);


-- Volunteer Profile's table
CREATE TABLE volunteer_profile (
	id SERIAL PRIMARY KEY,
	user_id INTEGER REFERENCES users(id),
	location_id INTEGER REFERENCES locations(id),
	status VARCHAR(15)
);



-- Disaster's table
CREATE TABLE disaster (
	id SERIAL PRIMARY KEY,
	created_by INTEGER REFERENCES users(id),
	title VARCHAR(15),
	description VARCHAR(50),
	type VARCHAR(15),
	severity VARCHAR(15),
	location_id INTEGER REFERENCES locations(id),
	radius FLOAT,
	external_id TEXT NULL,
	start_time TIMESTAMP NOT NULL,
	end_time TIMESTAMP,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP
)

-- Assignement's table
CREATE TABLE assignment (
	id SERIAL PRIMARY KEY,
	description VARCHAR(100),
	status VARCHAR(14),
	assigned_to INTEGER REFERENCES users(id),
	assigned_by INTEGER REFERENCES users(id),
	disaster_id INTEGER REFERENCES disaster(id),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP
);


-- Resource's table
CREATE TABLE resource (
	id SERIAL PRIMARY KEY,
	name VARCHAR(15),
	type VARCHAR(15),
	quantity INTEGER,
	status VARCHAR(15),
	assigned_by INTEGER REFERENCES users(id),
	location_id INTEGER REFERENCES locations(id),
	disaster_id INTEGER REFERENCES disaster(id),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP
)


-- Notification's Table
CREATE TABLE notification (
	id SERIAL PRIMARY KEY,
	user_id INTEGER REFERENCES users(id),
	type VARCHAR(15),
	title VARCHAR(15),
	message VARCHAR(100),
	is_read BOOLEAN,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP
)
