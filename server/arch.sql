CREATE TABLE admin (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    mail VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE clothes (
    id SERIAL PRIMARY KEY,
    image_id VARCHAR(100) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    artikul VARCHAR(100),
    store_name VARCHAR(100),
    store_url TEXT
);

CREATE TABLE outfits (
    id SERIAL PRIMARY KEY,
    image_id VARCHAR(100) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    season VARCHAR(50),
    label VARCHAR(50)
);

CREATE TABLE capsulas (
    id SERIAL PRIMARY KEY,
    image_id VARCHAR(100) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    season_1 VARCHAR(25) NOT NULL,
    season_2 VARCHAR(25) NOT NULL
);

CREATE TABLE outfits_superset (
    outfit_id INTEGER REFERENCES outfits(id) ON DELETE CASCADE,
    clothes_id INTEGER REFERENCES clothes(id) ON DELETE CASCADE,
    PRIMARY KEY (outfit_id, clothes_id)
);

CREATE TABLE capsulas_superset (
    capsulas_id INTEGER REFERENCES capsulas(id) ON DELETE CASCADE,
    outfit_id INTEGER REFERENCES outfits(id) ON DELETE CASCADE,
    PRIMARY KEY (capsulas_id, outfit_id)
);

CREATE TABLE users_liked (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    liked_type VARCHAR(20) NOT NULL CHECK (liked_type IN ('clothes', 'outfits', 'capsulas')),
    liked_id INTEGER NOT NULL
);
