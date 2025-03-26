 
 
 -- Assurez-vous d'être bien dans la base définie par POSTGRES_DB
 DROP TABLE IF EXISTS users;
 
  CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      role VARCHAR(50), 
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
  );

  -- Ajout de quelques utilisateurs pour tester
  INSERT INTO users (name, email, role, password) VALUES 
    ('Alice Dupont', 'alice.dupont@example.com', 'student', 'defaut'),
    ('Bob Martin', 'bob.martin@example.com', 'student', 'defaut');

