DROP TABLE IF EXISTS wall;

CREATE TABLE wall(
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users(id),
    first VARCHAR(200) CHECK (first <> ''),
    last VARCHAR(200) CHECK (last <> ''),
    url VARCHAR(300),
    picture VARCHAR(400),
    messages VARCHAR(500) CHECK (messages <> ''),
    description VARCHAR(500),
    link VARCHAR(400),
    publisher VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
