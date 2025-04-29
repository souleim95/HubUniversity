
CREATE TABLE IF NOT EXISTS role (
  idRole SERIAL PRIMARY KEY,
  nomRole VARCHAR(100) 
);

CREATE TABLE IF NOT EXISTS etat(
  idEtat SERIAL PRIMARY KEY, 
  nomEtat VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS etatSalle(
  idEtatSalle SERIAL PRIMARY KEY, 
  nomEtatSalle VARCHAR(50)
);

CREATE TABLE if NOT EXISTS modes(
  idModes SERIAL PRIMARY KEY, 
  nomModes VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS etatBorne(
  idEtatBorne SERIAL PRIMARY KEY, 
  nomEtatBorne VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS validationReservation(
  idVal SERIAL PRIMARY KEY, 
  nomValidation VARCHAR(50)
);

INSERT INTO etatSalle (nomEtatSalle) VALUES
  ('disponible'),
  ('occupé');

INSERT INTO etat(nomEtat) VALUES 
  ('éteint'), 
  ('allumé');

INSERT INTO modes(nomModes) VALUES
  ('Automatique'), 
  ('Manuel');

INSERT INTO etatBorne(nomEtatBorne) VALUES
  ('Hors Service'), 
  ('Inactif'), 
  ('Actif');


INSERT INTO validationReservation (nomValidation) VALUES 
  ('non validé'),
  ('en attente'), 
  ('validé');


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
  last_login TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (idRole) REFERENCES role(idRole)
);  


CREATE TABLE IF NOT EXISTS salle(
  idSalle SERIAL PRIMARY KEY,
  nomSalle VARCHAR(50),
  idEtatSalle INT, 
  capaciteSalle INT,
  FOREIGN KEY (idEtatSalle) REFERENCES etatSalle(idEtatSalle)
);

CREATE TABLE IF NOT EXISTS projecteur(
  idProjecteur SERIAL PRIMARY KEY, 
  nomProjecteur VARCHAR(50)  , 
  idSalle INT, 
  idEtat INT  ,
  FOREIGN KEY (idSalle) REFERENCES salle(idSalle) ON DELETE CASCADE,
  FOREIGN KEY (idEtat) REFERENCES etat(idEtat)
);

CREATE TABLE IF NOT EXISTS chauffage(
  idChauffage SERIAL PRIMARY KEY, 
  nomChauffage VARCHAR(50) , 
  idSalle INT,
  idEtat INT , 
  idModes INT , 
  FOREIGN KEY (idSalle) REFERENCES salle(idSalle) ON DELETE CASCADE,
  FOREIGN KEY (idEtat) REFERENCES etat(idEtat),
  FOREIGN KEY (idModes) REFERENCES modes(idModes)
);

CREATE TABLE IF NOT EXISTS eclairage(
  idEclairage SERIAL PRIMARY KEY, 
  nomEclairage VARCHAR(50) ,
  idSalle INT,
  idEtat INT ,
  FOREIGN KEY (idSalle) REFERENCES salle(idSalle) ON DELETE CASCADE,
  FOREIGN KEY (idEtat) REFERENCES etat(idEtat)
);

CREATE TABLE IF NOT EXISTS store(
  idStore SERIAL PRIMARY KEY, 
  nomStore VARCHAR(50) ,
  idSalle INT,
  idEtat INT ,
  FOREIGN KEY (idSalle) REFERENCES salle(idSalle) ON DELETE CASCADE,
  FOREIGN KEY (idEtat) REFERENCES etat(idEtat)
);

CREATE TABLE IF NOT EXISTS sysAudio(
  idAudio SERIAL PRIMARY KEY, 
  nomAudio VARCHAR(50) , 
  idSalle INT, 
  idEtat INT , 
  FOREIGN KEY (idSalle) REFERENCES salle(idSalle) ON DELETE CASCADE,
  FOREIGN KEY (idEtat) REFERENCES etat(idEtat)
);

CREATE TABLE IF NOT EXISTS grille(
  idGrille SERIAL PRIMARY KEY, 
  nomGrille VARCHAR(50) , 
  idEtat INT ,
  idSalle INT,
  FOREIGN KEY (idSalle) REFERENCES salle(idSalle) ON DELETE CASCADE,
  FOREIGN KEY (idEtat) REFERENCES etat(idEtat)
); 

CREATE TABLE IF NOT EXISTS camera(
  idCamera SERIAL PRIMARY KEY, 
  nomCamera VARCHAR(50) , 
  idEtat INT ,
  idSalle INT,
  FOREIGN KEY (idSalle) REFERENCES salle(idSalle) ON DELETE CASCADE,
  FOREIGN KEY (idEtat) REFERENCES etat(idEtat)
);

CREATE TABLE IF NOT EXISTS porte(
  idPorte SERIAL PRIMARY KEY, 
  nomPorte VARCHAR(50) , 
  idEtat INT ,
  idSalle INT,
  FOREIGN KEY (idSalle) REFERENCES salle(idSalle) ON DELETE CASCADE,
  FOREIGN KEY (idEtat) REFERENCES etat(idEtat)
); 

CREATE TABLE IF NOT EXISTS capteur(
  idCapteur SERIAL PRIMARY KEY, 
  nomCapteur VARCHAR(50) , 
  idEtat INT ,
  idSalle INT,
  FOREIGN KEY (idSalle) REFERENCES salle(idSalle) ON DELETE CASCADE,
  FOREIGN KEY (idEtat) REFERENCES etat(idEtat)
); 

CREATE TABLE IF NOT EXISTS borne(
  idBorne SERIAL PRIMARY KEY, 
  nomBorne VARCHAR(50) , 
  idEtatBorne INT ,
  idSalle INT,
  FOREIGN KEY (idSalle) REFERENCES salle(idSalle) ON DELETE CASCADE,
  FOREIGN KEY (idEtatBorne) REFERENCES etatBorne(idEtatBorne)
); 

CREATE TABLE IF NOT EXISTS distributeur (
  idDistributeur SERIAL PRIMARY KEY,
  nomDistributeur VARCHAR(50) ,
  idSalle INT,
  idEtat INTEGER REFERENCES etat(idEtat),
  FOREIGN KEY (idSalle) REFERENCES salle(idSalle) ON DELETE CASCADE
);

-- Cafetières
CREATE TABLE IF NOT EXISTS cafetiere (
  idCafetiere SERIAL PRIMARY KEY,
  nomCafetiere VARCHAR(50) ,
  idSalle INT,
  FOREIGN KEY (idSalle) REFERENCES salle(idSalle) ON DELETE CASCADE,
  idEtat INTEGER  REFERENCES etat(idEtat)
);

-- Microwaves
CREATE TABLE IF NOT EXISTS microwave (
  idMicrowave SERIAL PRIMARY KEY,
  nomMicrowave VARCHAR(50) ,
  idSalle INT,
  FOREIGN KEY (idSalle) REFERENCES salle(idSalle) ON DELETE CASCADE,
  idEtat INTEGER  REFERENCES etat(idEtat)
);

-- AirSensors
CREATE TABLE IF NOT EXISTS airSensor (
  idAirSensor SERIAL PRIMARY KEY,
  nomAirSensor VARCHAR(50) ,
  idSalle INT,
  FOREIGN KEY (idSalle) REFERENCES salle(idSalle) ON DELETE CASCADE,
  idEtat INTEGER  REFERENCES etat(idEtat)
);

-- Dishwashers
CREATE TABLE IF NOT EXISTS dishwasher (
  idDishwasher SERIAL PRIMARY KEY,
  nomDishwasher VARCHAR(50) ,
  idSalle INT,
  FOREIGN KEY (idSalle) REFERENCES salle(idSalle) ON DELETE CASCADE,
  idEtat INTEGER  REFERENCES etat(idEtat)
);

-- Ventilations
CREATE TABLE IF NOT EXISTS ventilation (
  idVentilation SERIAL PRIMARY KEY,
  nomVentilation VARCHAR(50) ,
  idSalle INT,
  idEtat INTEGER  REFERENCES etat(idEtat),
  FOREIGN KEY (idSalle) REFERENCES salle(idSalle) ON DELETE CASCADE,
  idModes INTEGER  REFERENCES modes(idModes)
);

-- Scanners
CREATE TABLE IF NOT EXISTS scanner (
  idScanner SERIAL PRIMARY KEY,
  nomScanner VARCHAR(50) ,
  idSalle INT,
  idEtat INTEGER  REFERENCES etat(idEtat),
  FOREIGN KEY (idSalle) REFERENCES salle(idSalle) ON DELETE CASCADE
  
);

-- Affichages
CREATE TABLE IF NOT EXISTS affichage (
  idAffichage SERIAL PRIMARY KEY,
  nomAffichage VARCHAR(50) ,
  idSalle INT,
  FOREIGN KEY (idSalle) REFERENCES salle(idSalle) ON DELETE CASCADE,
  idEtat INTEGER  REFERENCES etat(idEtat)
);

CREATE TABLE IF NOT EXISTS barriere ( 
  idBarriere SERIAL PRIMARY KEY,
  nomBarriere VARCHAR(50) ,
  idSalle INT,
  FOREIGN KEY (idSalle) REFERENCES salle(idSalle) ON DELETE CASCADE,
  idEtat INTEGER  REFERENCES etat(idEtat)
);

CREATE TABLE IF NOT EXISTS hotte (
  idHotte SERIAL PRIMARY KEY, 
  nomHotte VARCHAR(50) ,
  idSalle INTEGER REFERENCES salle(idSalle) ON DELETE CASCADE, 
  idEtat INTEGER REFERENCES etat(idEtat)
);

CREATE TABLE IF NOT EXISTS panneau(
  idPanneau SERIAL PRIMARY KEY, 
  nomPanneau VARCHAR(50) , 
  idEtat INTEGER REFERENCES etat(idEtat)
);

CREATE TABLE IF NOT EXISTS alarme(
  idAlarme SERIAL PRIMARY KEY, 
  nomAlarme VARCHAR(50) ,
  idEtat INTEGER REFERENCES etat(idEtat)
);

CREATE TABLE IF NOT EXISTS alerte(
  idAlerte SERIAL PRIMARY KEY, 
  message VARCHAR(50), 
  idSalle INTEGER REFERENCES salle(idSalle) ON DELETE CASCADE, 
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reservation (
  idReservation SERIAL PRIMARY KEY,
  idSalle       INTEGER NOT NULL REFERENCES salle(idSalle) ON DELETE CASCADE,
  start_datetime TIMESTAMP NOT NULL,  -- date+heure de début
  end_datetime   TIMESTAMP NOT NULL,  -- date+heure de fin
  idValidationReservation INTEGER NOT NULL REFERENCES validationReservation(idVal) DEFAULT 1,         -- « non validé » par défaut
  created_at     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS action_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action TEXT ,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  details TEXT
);
ALTER TABLE action_history
DROP CONSTRAINT action_history_user_id_fkey,
ADD CONSTRAINT action_history_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES users(id)
ON DELETE CASCADE;

INSERT INTO salle (nomSalle, idEtatSalle, capaciteSalle) VALUES
  ('Salle informatique', 1, 30),
  ('Amphithéâtre GIA 1',  1, 200),
  ('Réfectoire',  1, 150),
  ('Laboratoire de chimie',1, 24),
  ('Bibliothèque', 1, 100),
  ('Gymnase', 1, 150);

INSERT INTO projecteur (nomProjecteur, idSalle, idEtat)
VALUES
  ('Projecteur - Salle Informatique', 1, 1),
  ('Projecteur - Amphithéâtre GIA1', 2, 1);
  

-- 2) Chauffage allumé en mode auto à 19°C
INSERT INTO chauffage (nomChauffage, idSalle, idEtat, idModes)
VALUES
  ('Chauffage - Salle Informatique', 1, 2, 1),
  ('Chauffage - Amphithéâtre GIA1', 2, 1, 1),
  ('Chauffage - Refectoire ', 3, 1, 2);

-- 3) Éclairage éteint à 0% de luminosité
INSERT INTO eclairage (nomEclairage, idSalle, idEtat)
VALUES
  ('Éclairage - Salle Informatique', 1, 1),
  ('Éclairage - Amphithéâtre GIA1', 2, 2),
  ('Éclairage - Réfectoire', 3, 2); 

INSERT INTO eclairage(nomEclairage, idEtat)
VALUES  
  ('Éclairage - Hall Principal', 1), 
  ('Éclairage Secours ', 1),
  ('Éclairage Parking' , 1);

-- 4) Store fermé à 0% d’ouverture
INSERT INTO store (nomStore, idSalle, idEtat)
VALUES
  ('Store - Salle Informatique', 1, 1),
  ('Store - Amphithéâtre GIA1', 2, 1),
  ('Store - Réfectoire', 3, 1);

INSERT INTO distributeur(nomDistributeur,idSalle)
VALUES 
  ('Distributeurs de Boissons', 3),
  ('Distributeur de Snacks', 3) ;

INSERT INTO cafetiere (nomCafetiere, idSalle , idEtat)
VALUES 
  ('Cafetière automatique ', 3, 2); 

INSERT INTO microwave(nomMicrowave, idSalle, idEtat) 
VALUES
  ('micro-onde connecté', 3, 1);

INSERT INTO capteur(nomCapteur, idSalle, idEtat)
VALUES  
  ('Capteur Qualité Air', 3, 2),
  ('Detecteur de fumée', 3, 2), 
  ('Detecteur de gaz', 4, 2);

INSERT INTO capteur(nomCapteur, idEtat)
VALUES  
  ('Capteur de présence', 2),
  ('Detecteur Occupation', 2);
INSERT INTO dishwasher (nomDishwasher, idSalle, idEtat)
VALUES 
  ('Lave-Vaisselle Refectoire', 3, 1);

INSERT INTO grille (nomGrille, idEtat)
VALUES 
  ('Grille Principale', 1);

INSERT INTO porte (nomPorte, idEtat)
VALUES 
  ('Porte Principale Batiment A', 1);

INSERT INTO camera (nomCamera, idEtat)
VALUES
  ('Camera Issue de Secours', 1), 
  ('Camera Parking', 1), 
  ('Camera Entrée ', 2); 

INSERT INTO borne (nomBorne, idEtatBorne)
VALUES 
  ('Borne de recharge', 1),
  ('Borne pret/retour', 2); 

INSERT INTO barriere (nombarriere, idEtat)
VALUES 
  ('Barrière  Parking', 1); 

INSERT INTO ventilation(nomVentilation, idSalle, idModes)
VALUES
  ('Systeme  de Ventilation', 6, 1); 

INSERT INTO sysAudio(nomAudio, idSalle, idEtat) 
VALUES 
  ('Systeme Audio', 2, 1),
  ('Sonorisation', 6, 1); 

INSERT INTO scanner (nomScanner, idSalle, idEtat) 
VALUES 
  ('Scanner de Livres' , 5, 2); 

INSERT INTO hotte (nomHotte, idSalle, idEtat)
VALUES 
  ('Hotte Aspirante ', 4, 1);

INSERT INTO affichage(nomAffichage, idSalle, idEtat)
VALUES 
  ('Tableau de Scores ', 6, 1); 

INSERT INTO alarme(nomAlarme)
VALUES 
  ('Alarme Incendie');

INSERT INTO panneau (nomPanneau)
VALUES 
  ('Affichages Places '), 
  ('Panneau d information ');