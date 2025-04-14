CREATE TABLE IF NOT EXISTS role (
  idRole SERIAL PRIMARY KEY,
  nomRole VARCHAR(100) NOT NULL
);

INSERT INTO role (nomRole) VALUES
  ('eleve'),
  ('professeur'),
  ('directeur');

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  idRole INTEGER DEFAULT 1,
  password VARCHAR(255) NOT NULL,
  score INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (idRole) REFERENCES role(idRole)
);
