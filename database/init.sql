DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS role;

CREATE TABLE role (
  idRole SERIAL PRIMARY KEY,
  nomRole VARCHAR(100) NOT NULL
);

INSERT INTO role (nomRole) VALUES
  ('eleve'),      -- Accès aux modules publics (ex: Information)
  ('professeur'), -- Niveau débutant/intermédiaire (ex: Visualisation Modification partiel)
  ('directeur');  -- Niveau expert (ex: tous les droits)

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  idRole INTEGER DEFAULT 1,  -- Par défaut, le rôle 'eleve'
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (idRole) REFERENCES role(idRole)
);

INSERT INTO users (name, email, idRole, password) VALUES 
  ('Alice Dupont', 'alice.dupont@example.com', 2, 'defaut'),
  ('Bob Martin', 'bob.martin@example.com', 2, 'defaut');

