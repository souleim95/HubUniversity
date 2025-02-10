-- Assurez-vous d'être bien dans la base définie par POSTGRES_DB
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Ajout de quelques utilisateurs pour tester
INSERT INTO users (name, email) VALUES 
  ('Alice Dupont', 'alice.dupont@example.com'),
  ('Bob Martin', 'bob.martin@example.com');

