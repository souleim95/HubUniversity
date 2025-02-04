-- database/init.sql
CREATE DATABASE projet_universite;

\c projet_universite

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Test utilisateur ajouté
INSERT INTO users (name, email) VALUES 
  ('Alice Dupont', 'alice.dupont@example.com'),
  ('Bob Martin', 'bob.martin@example.com');
