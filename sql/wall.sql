DROP TABLE IF EXISTS wall;

CREATE TABLE wall(
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users(id),
    first VARCHAR(200) NOT NULL CHECK (first <> ''),
    last VARCHAR(200) NOT NULL CHECK (last <> ''),
    url VARCHAR(300),
    picture VARCHAR(400),
    messages VARCHAR(500) NOT NULL CHECK (messages <> ''),
    link VARCHAR(400),
    publisher VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
