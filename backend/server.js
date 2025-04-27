require('dotenv').config({ path: './Database-URL.env' });
console.log("🔍 DATABASE_URL (avant connexion):", process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
  console.error("❌ ERREUR: DATABASE_URL est undefined. Vérifiez votre fichier .env !");
  process.exit(1); // Arrête le serveur immédiatement
}

const express = require('express');
const cors = require('cors');
const path = require('path'); // Pour gérer les chemins vers les fichiers statiques
const { Server } = require("socket.io");
const http = require("http");
const { Pool } = require("pg");
const bcrypt = require('bcrypt');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors({
  origin: 'http://localhost:3000', // ou l'URL de votre frontend
  credentials: true
}));
app.use(express.json());

// Connexion à PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false, // Désactive le SSL
});
pool.connect()
  .then(() => console.log("✅ Connexion PostgreSQL réussie"))
  .catch(err => console.error("❌ Erreur de connexion à PostgreSQL :", err));

// -------------------------
// Routes API (backend)
// -------------------------

// Route de test de l'API
app.get("/api", (req, res) => res.send("Backend API is running 🚀"));

// Route pour récupérer les utilisateurs avec leur rôle
app.get("/api/users", async (req, res) => {
  try {
    const query = `
        SELECT 
          u.id,
          u.name,
          u.email,
          COALESCE(u.score, 0) AS score,
          r.nomRole AS role,
          u.created_at,
          u.last_login
        FROM users u
        JOIN role r ON u.idRole = r.idRole
        ORDER BY u.id
      `;
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error("Erreur de récupération des utilisateurs :", err);
    res.status(500).send("Erreur serveur");
  }
});

// Route pour ajouter un nouvel utilisateur (code corrigé)
app.post("/api/users", async (req, res) => {
  const { name, email, role, password } = req.body;
  // Vérification des champs obligatoires
  if (!name || !email || !role || !password) {
    return res.status(400).json({ 
      error: "Les champs name, email, role et password sont obligatoires." 
    });
  }

  try {
    // 1. Vérifier que le rôle existe et récupérer son id
    const roleResult = await pool.query(
      "SELECT idRole FROM role WHERE nomRole = $1",
      [role]
    );
    if (roleResult.rows.length === 0) {
      return res.status(400).json({ error: `Le rôle '${role}' est invalide.` });
    }
    const idRole = roleResult.rows[0].idrole || roleResult.rows[0].idRole;

    // 2. Hacher le mot de passe
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 3. Insérer le nouvel utilisateur avec l’idRole récupéré
    const insertResult = await pool.query(
      "INSERT INTO users (name, email, idRole, password) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, idRole, passwordHash]
    );
    const newUser = insertResult.rows[0];

    // 4. Log pour vérification (optionnel)
    console.log("Nouvel utilisateur ajouté :", newUser);

    // 5. Retourner l’utilisateur (sans le mot de passe)
    res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: role  
    });
  } catch (err) {
    console.error("Erreur lors de l'ajout d'un utilisateur :", err);
    // Vérifier le code d'erreur pour une violation de contrainte unique (duplicate email)
    if (err.code === '23505') {
      return res.status(400).json({ error: "Un utilisateur utilise déjà cette adresse e-mail. Veuillez la changer." });
    }
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
});




// Connexion : Route pour se connecter
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Les champs email et password sont obligatoires." });
  }

  try {
    // Requête jointe pour récupérer le nom du rôle (r.nomRole as role)
    const query = `
      SELECT u.id, u.name, u.email, u.password, COALESCE(u.score, 0) as score, r.nomRole as role
      FROM users u 
      JOIN role r ON u.idRole = r.idRole
      WHERE u.email = $1
    `;
    const { rows } = await pool.query(query, [email]);
    const user = rows[0];
    console.log("Utilisateur trouvé :", rows);

    if (!user) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect." });
    }

    const match = await bcrypt.compare(password, user.password);

    // 3. Incrémentation automatique du score (+1)
    const updateScoreResult = await pool.query(
      `UPDATE users
        SET score = COALESCE(score, 0) + 100
        WHERE id = $1
        RETURNING score`,
      [user.id]
    );
    const newScore = updateScoreResult.rows[0].score;
    

    if (match) {
      // On renvoie l'objet utilisateur sans le mot de passe.
      res.json({ 
        message: "Connexion réussie", 
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          role: user.role, 
          score: newScore
        }
      });
    } else {
      res.status(401).json({ error: "Email ou mot de passe incorrect." });
    }
  } catch (err) {
    console.error("Erreur lors de la connexion :", err);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
});

app.get("/api/rer-schedule", async (req, res) => {
  try {
    const apiKey = process.env.API_SNCF_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Clé API SNCF non configurée" });
    }
    // Utilisation du code UIC de Cergy Préfecture : 87381905
    const stopAreaId = "stop_area:OCE:SA:87381905";
    const count = 10;
    // Construction de l'URL pour récupérer les 10 prochains départs du RER A
    const url = `https://api.sncf.com/v1/coverage/sncf/stop_areas/${stopAreaId}/departures?count=${count}&filter[]=line.name=RER A`;
    
    // Authentification Basic : username = API key, password vide
    const auth = Buffer.from(apiKey + ":").toString("base64");

    const response = await fetch(url, {
      headers: {
        "Authorization": `Basic ${auth}`
      }
    });
    const data = await response.json();

    let versParis = [];
    let versCergy = [];

    if (data.departures) {
      data.departures.forEach(dep => {
        const direction = dep.display_informations && dep.display_informations.direction;
        const departureTime = dep.stop_date_time && dep.stop_date_time.departure_date_time;
        const time = departureTime ? departureTime.substr(11, 5) : "";
        if (direction) {
          const directionLower = direction.toLowerCase();
          if (directionLower.includes("paris")) {
            versParis.push(time);
          } else if (directionLower.includes("cergy")) {
            versCergy.push(time);
          }
        }
      });
    }
    
    res.json({ versParis, versCergy });
  } catch (err) {
    console.error("Erreur lors de la récupération des horaires RER :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Route pour augmenter le score d'un utilisateur
app.patch("/api/users/:id/score", async (req, res) => {
// Récupération de l'id de l'utilisateur depuis l'URL
  const { id } = req.params;

  // Dans le corps de la requête, on attend une propriété "increment"
  // qui indique combien le score doit être augmenté.
  // Par exemple, { "increment": 1 } pour ajouter 1 point.
  const { increment } = req.body;
  
  if (increment === undefined) {
    return res.status(400).json({ error: "Le champ 'increment' est requis." });
  }
  
  try {
    // La requête SQL met à jour le score en s'assurant que
    // s'il est NULL (non défini), on le considère comme 0 avec COALESCE.
    const updateQuery = `
      UPDATE users 
      SET score = COALESCE(score, 0) + $1 
      WHERE id = $2 
      RETURNING score
    `;
    
    const { rows } = await pool.query(updateQuery, [increment, id]);
    
// Si aucun utilisateur n'est trouvé, retourner une erreur 404.
    if (rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }
    
    // Mettre à jour le rôle si nécessaire
    const score = rows[0].score;
    let newRole = null;
    
    // Définir le nouveau rôle en fonction du score
    if (score >= 1000) {
      newRole = 'directeur';
    } else if (score >= 500) {
      newRole = 'professeur';
    }
    
    if (newRole) {
      // Mettre à jour le rôle dans la base de données
      await pool.query(`
        UPDATE users 
        SET idrole = (SELECT idrole FROM role WHERE nomrole = $1) 
        WHERE id = $2
      `, [newRole, id]);
    }
    
    res.json({
      message: "Score mis à jour avec succès.",
      score: rows[0].score,
      role: newRole // Inclure le nouveau rôle dans la réponse si changé
    });
    
  } catch (err) {
    console.error("Erreur lors de la mise à jour du score :", err);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
});



// CRUD routes for all entities
// Assumes you have `app` (Express) and `pool` (pg Pool) already configured

// Helper to handle async errors
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

app.get("/api/salles", asyncHandler(async (req, res) => {
  const query = `
    SELECT 
      s.idSalle,
      s.nomSalle,
      s.capaciteSalle,
      s.idEtatSalle,
      e.nomEtatSalle
    FROM salle s
    JOIN etatSalle e ON s.idEtatSalle = e.idEtatSalle
    ORDER BY s.idSalle
  `;
  const { rows } = await pool.query(query);
  res.json(rows);
}));

app.get("/api/objets", asyncHandler(async (req, res) => {
  const query = `
    WITH all_objs AS (
      SELECT 'projecteur'   AS type, idProjecteur AS id, nomProjecteur   AS nom, projecteur.idEtat    AS rawEtat FROM projecteur
      UNION ALL
      SELECT 'chauffage',   idChauffage,  nomChauffage,   chauffage.idEtat     FROM chauffage
      UNION ALL
      SELECT 'eclairage',   idEclairage,  nomEclairage,   eclairage.idEtat     FROM eclairage
      UNION ALL
      SELECT 'store',       idStore,      nomStore,       store.idEtat         FROM store
      UNION ALL
      SELECT 'sysAudio',    idAudio,      nomAudio,       sysAudio.idEtat      FROM sysAudio
      UNION ALL
      SELECT 'grille',      idGrille,     nomGrille,      grille.idEtat        FROM grille
      UNION ALL
      SELECT 'camera',      idCamera,     nomCamera,      camera.idEtat        FROM camera
      UNION ALL
      SELECT 'porte',       idPorte,      nomPorte,       porte.idVerrouillage FROM porte
      UNION ALL
      SELECT 'capteur',     idCapteur,    nomCapteur,     capteur.idEtat       FROM capteur
      UNION ALL
      SELECT 'borne',       idBorne,      nomBorne,       borne.idEtatBorne    FROM borne
      UNION ALL
      SELECT 'cafetiere',   idCafetiere,  nomCafetiere,   cafetiere.idEtat     FROM cafetiere
      UNION ALL
      SELECT 'microwave',   idMicrowave,  nomMicrowave,   microwave.idEtat     FROM microwave
      UNION ALL
      SELECT 'airSensor',   idAirSensor,  nomAirSensor,   airSensor.idEtat     FROM airSensor
      UNION ALL
      SELECT 'dishwasher',  idDishwasher, nomDishwasher,  dishwasher.idEtat    FROM dishwasher
      UNION ALL
      SELECT 'ventilation', idVentilation,nomVentilation, ventilation.idModes  FROM ventilation
      UNION ALL
      SELECT 'scanner',     idScanner,    nomScanner,     scanner.idEtat       FROM scanner
      UNION ALL
      SELECT 'affichage',   idAffichage,  nomAffichage,   affichage.idEtat     FROM affichage
      UNION ALL
      SELECT 'barriere',    idBarriere,   nomBarriere,    barriere.idEtat      FROM barriere
      UNION ALL
      SELECT 'hotte',       idHotte,      nomHotte,       hotte.idEtat         FROM hotte
    )
    SELECT 
      o.type,
      o.id,
      o.nom,
      o.rawEtat   AS idEtat,
      COALESCE(e.nomEtat, eb.nomEtatBorne) AS etat
    FROM all_objs o
      LEFT JOIN etat      e  ON o.rawEtat = e.idEtat
      LEFT JOIN etatBorne eb ON o.rawEtat = eb.idEtatBorne
    ORDER BY o.type, o.id
  `;

  try {
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error("❌ Erreur SQL /api/objets :", err.message);
    res.status(500).json({ error: "Erreur interne", details: err.message });
  }
}));
app.get("/api/objets", asyncHandler(async (req, res) => {
  const query = `
    -- Projecteurs
    SELECT 
      'projecteur'   AS type,
      p.idProjecteur AS id,
      p.nomProjecteur AS nom,
      e.nomEtat       AS etat
    FROM projecteur p
    LEFT JOIN etat e      ON p.idEtat = e.idEtat

    UNION ALL

    -- Chauffages
    SELECT 
      'chauffage'   AS type,
      c.idChauffage AS id,
      c.nomChauffage AS nom,
      e.nomEtat      AS etat
    FROM chauffage c
    LEFT JOIN etat e      ON c.idEtat = e.idEtat

    UNION ALL

    -- Éclairages
    SELECT 
      'eclairage'    AS type,
      l.idEclairage  AS id,
      l.nomEclairage AS nom,
      e.nomEtat      AS etat
    FROM eclairage l
    LEFT JOIN etat e      ON l.idEtat = e.idEtat

    UNION ALL

    -- Stores
    SELECT 
      'store'    AS type,
      s.idStore  AS id,
      s.nomStore AS nom,
      e.nomEtat  AS etat
    FROM store s
    LEFT JOIN etat e      ON s.idEtat = e.idEtat

    UNION ALL

    -- Audio
    SELECT 
      'sysAudio' AS type,
      a.idAudio  AS id,
      a.nomAudio AS nom,
      e.nomEtat  AS etat
    FROM sysAudio a
    LEFT JOIN etat e      ON a.idEtat = e.idEtat

    UNION ALL

    -- Grilles
    SELECT 
      'grille'   AS type,
      g.idGrille AS id,
      g.nomGrille AS nom,
      e.nomEtat   AS etat
    FROM grille g
    LEFT JOIN etat e      ON g.idEtat = e.idEtat

    UNION ALL

    -- Caméras
    SELECT 
      'camera'   AS type,
      c.idCamera AS id,
      c.nomCamera AS nom,
      e.nomEtat   AS etat
    FROM camera c
    LEFT JOIN etat e      ON c.idEtat = e.idEtat

    UNION ALL

    -- Portes (verrouillage)
    SELECT 
      'porte'          AS type,
      p.idPorte        AS id,
      p.nomPorte       AS nom,
      e.nomEtat        AS etat
    FROM porte p
    LEFT JOIN etat e      ON p.idVerrouillage = e.idEtat

    UNION ALL

    -- Capteurs
    SELECT 
      'capteur'     AS type,
      c.idCapteur   AS id,
      c.nomCapteur  AS nom,
      e.nomEtat     AS etat
    FROM capteur c
    LEFT JOIN etat e      ON c.idEtat = e.idEtat

    UNION ALL

    -- Bornes
    SELECT 
      'borne'       AS type,
      b.idBorne     AS id,
      b.nomBorne    AS nom,
      eb.nomEtatBorne AS etat
    FROM borne b
    LEFT JOIN etatBorne eb ON b.idEtatBorne = eb.idEtatBorne

    UNION ALL

    -- Cafetières
    SELECT 
      'cafetiere'   AS type,
      c.idCafetiere AS id,
      c.nomCafetiere AS nom,
      e.nomEtat      AS etat
    FROM cafetiere c
    LEFT JOIN etat e      ON c.idEtat = e.idEtat

    UNION ALL

    -- Micro-ondes
    SELECT 
      'microwave'    AS type,
      m.idMicrowave  AS id,
      m.nomMicrowave AS nom,
      e.nomEtat      AS etat
    FROM microwave m
    LEFT JOIN etat e      ON m.idEtat = e.idEtat

    UNION ALL

    -- AirSensors
    SELECT 
      'airSensor'    AS type,
      a.idAirSensor  AS id,
      a.nomAirSensor AS nom,
      e.nomEtat      AS etat
    FROM airSensor a
    LEFT JOIN etat e      ON a.idEtat = e.idEtat

    UNION ALL

    -- Dishwashers
    SELECT 
      'dishwasher'   AS type,
      d.idDishwasher AS id,
      d.nomDishwasher AS nom,
      e.nomEtat       AS etat
    FROM dishwasher d
    LEFT JOIN etat e      ON d.idEtat = e.idEtat

    UNION ALL

    -- Ventilations (on prend le mode comme état)
    SELECT 
      'ventilation'   AS type,
      v.idVentilation AS id,
      v.nomVentilation AS nom,
      m.nomModes       AS etat
    FROM ventilation v
    LEFT JOIN modes m    ON v.idModes = m.idModes

    UNION ALL

    -- Scanners
    SELECT 
      'scanner'     AS type,
      s.idScanner   AS id,
      s.nomScanner  AS nom,
      e.nomEtat     AS etat
    FROM scanner s
    LEFT JOIN etat e      ON s.idEtat = e.idEtat

    UNION ALL

    -- Affichages
    SELECT 
      'affichage'   AS type,
      a.idAffichage AS id,
      a.nomAffichage AS nom,
      e.nomEtat      AS etat
    FROM affichage a
    LEFT JOIN etat e      ON a.idEtat = e.idEtat

    UNION ALL

    -- Barrières
    SELECT 
      'barriere'    AS type,
      b.idBarriere  AS id,
      b.nomBarriere AS nom,
      e.nomEtat     AS etat
    FROM barriere b
    LEFT JOIN etat e      ON b.idEtat = e.idEtat

    UNION ALL

    -- Hottes
    SELECT 
      'hotte'      AS type,
      h.idHotte    AS id,
      h.nomHotte   AS nom,
      e.nomEtat    AS etat
    FROM hotte h
    LEFT JOIN etat e      ON h.idEtat = e.idEtat

    UNION ALL

    -- Distributeurs (pas d'état)
    SELECT 
      'distributeur'   AS type,
      d.idDistributeur AS id,
      d.nomDistributeur AS nom,
      NULL               AS etat
    FROM distributeur d

    UNION ALL

    -- Panneaux (pas d'état)
    SELECT 
      'panneau'   AS type,
      p.idPanneau AS id,
      p.nomPanneau AS nom,
      NULL         AS etat
    FROM panneau p

    UNION ALL

    -- Alarmes (pas d'état)
    SELECT 
      'alarme'   AS type,
      a.idAlarme AS id,
      a.nomAlarme AS nom,
      NULL        AS etat
    FROM alarme a
  `;

  try {
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error("❌ Erreur SQL /api/objets :", err.message);
    res.status(500).json({ error: "Erreur interne", details: err.message });
  }
}));

// == Salles ==
app.post("/api/salles", asyncHandler(async (req, res) => {
  const { nomSalle, idEtatSalle, capaciteSalle } = req.body;
  const result = await pool.query(
    `INSERT INTO salle (nomSalle, idEtatSalle, capaciteSalle) VALUES ($1,$2,$3) RETURNING *`,
    [nomSalle, idEtatSalle, capaciteSalle]
  );
  res.status(201).json(result.rows[0]);
}));

app.delete("/api/salles/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    `DELETE FROM salle WHERE idSalle = $1 RETURNING *`, [id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Salle non trouvée' });
  res.json({ message: 'Salle supprimée', salle: result.rows[0] });
}));

// == Projecteurs ==
app.post("/api/projecteurs", asyncHandler(async (req, res) => {
  const { nomProjecteur, idSalle, idEtat } = req.body;
  const result = await pool.query(
    `INSERT INTO projecteur (nomProjecteur, idSalle, idEtat) VALUES ($1,$2,$3) RETURNING *`,
    [nomProjecteur, idSalle, idEtat]
  );
  res.status(201).json(result.rows[0]);
}));

app.delete("/api/projecteurs/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    `DELETE FROM projecteur WHERE idProjecteur = $1 RETURNING *`, [id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Projecteur non trouvé' });
  res.json({ message: 'Projecteur supprimé', projecteur: result.rows[0] });
}));

// == Chauffages ==
app.post("/api/chauffages", asyncHandler(async (req, res) => {
  const { nomChauffage, idSalle, idEtat, idModes, temperature } = req.body;
  const result = await pool.query(
    `INSERT INTO chauffage (nomChauffage, idSalle, idEtat, idModes, temperature) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [nomChauffage, idSalle, idEtat, idModes, temperature]
  );
  res.status(201).json(result.rows[0]);
}));

app.delete("/api/chauffages/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    `DELETE FROM chauffage WHERE idChauffage = $1 RETURNING *`, [id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Chauffage non trouvé' });
  res.json({ message: 'Chauffage supprimé', chauffage: result.rows[0] });
}));

// == Eclairages ==
app.post("/api/eclairages", asyncHandler(async (req, res) => {
  const { nomEclairage, idSalle, idEtat } = req.body;
  const result = await pool.query(
    `INSERT INTO eclairage (nomEclairage, idSalle, idEtat) VALUES ($1,$2,$3) RETURNING *`,
    [nomEclairage, idSalle, idEtat]
  );
  res.status(201).json(result.rows[0]);
}));

app.delete("/api/eclairages/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    `DELETE FROM eclairage WHERE idEclairage = $1 RETURNING *`, [id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Éclairage non trouvé' });
  res.json({ message: 'Éclairage supprimé', eclairage: result.rows[0] });
}));

// == Stores ==
app.post("/api/stores", asyncHandler(async (req, res) => {
  const { nomStore, idSalle, idEtat, ouverture } = req.body;
  const result = await pool.query(
    `INSERT INTO store (nomStore, idSalle, ouverture, idEtat) VALUES ($1,$2,$3,$4) RETURNING *`,
    [nomStore, idSalle, ouverture, idEtat]
  );
  res.status(201).json(result.rows[0]);
}));

app.delete("/api/stores/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    `DELETE FROM store WHERE idStore = $1 RETURNING *`, [id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Store non trouvé' });
  res.json({ message: 'Store supprimé', store: result.rows[0] });
}));

// == Audio ==
app.post("/api/sysAudio", asyncHandler(async (req, res) => {
  const { nomAudio, idSalle, idEtat, puissance } = req.body;
  const result = await pool.query(
    `INSERT INTO sysAudio (nomAudio, idSalle, puissance, idEtat) VALUES ($1,$2,$3,$4) RETURNING *`,
    [nomAudio, idSalle, puissance, idEtat]
  );
  res.status(201).json(result.rows[0]);
}));

app.delete("/api/sysAudio/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    `DELETE FROM sysAudio WHERE idAudio = $1 RETURNING *`, [id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Audio non trouvé' });
  res.json({ message: 'Audio supprimé', audio: result.rows[0] });
}));

// == Grilles ==
app.post("/api/grilles", asyncHandler(async (req, res) => {
  const { nomGrille, idSalle, idEtat } = req.body;
  const result = await pool.query(
    `INSERT INTO grille (nomGrille, idSalle, idEtat) VALUES ($1,$2,$3) RETURNING *`,
    [nomGrille, idSalle, idEtat]
  );
  res.status(201).json(result.rows[0]);
}));

app.delete("/api/grilles/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    `DELETE FROM grille WHERE idGrille = $1 RETURNING *`, [id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Grille non trouvée' });
  res.json({ message: 'Grille supprimée', grille: result.rows[0] });
}));

// == Cameras ==
app.post("/api/cameras", asyncHandler(async (req, res) => {
  const { nomCamera, idSalle, idEtat } = req.body;
  const result = await pool.query(
    `INSERT INTO camera (nomCamera, idSalle, idEtat) VALUES ($1,$2,$3) RETURNING *`,
    [nomCamera, idSalle, idEtat]
  );
  res.status(201).json(result.rows[0]);
}));

app.delete("/api/cameras/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    `DELETE FROM camera WHERE idCamera = $1 RETURNING *`, [id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Caméra non trouvée' });
  res.json({ message: 'Caméra supprimée', camera: result.rows[0] });
}));

// == Portes ==
app.post("/api/portes", asyncHandler(async (req, res) => {
  const { nomPorte, idSalle, idEtat } = req.body;
  const result = await pool.query(
    `INSERT INTO porte (nomPorte, idSalle, idEtat) VALUES ($1,$2,$3) RETURNING *`,
    [nomPorte, idSalle, idEtat]
  );
  res.status(201).json(result.rows[0]);
}));

app.delete("/api/portes/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    `DELETE FROM porte WHERE idPorte = $1 RETURNING *`, [id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Porte non trouvée' });
  res.json({ message: 'Porte supprimée', porte: result.rows[0] });
}));

// == Capteurs ==
app.post("/api/capteurs", asyncHandler(async (req, res) => {
  const { nomCapteur, idSalle, idEtat } = req.body;
  const result = await pool.query(
    `INSERT INTO capteur (nomCapteur, idSalle, idEtat) VALUES ($1,$2,$3) RETURNING *`,
    [nomCapteur, idSalle, idEtat]
  );
  res.status(201).json(result.rows[0]);
}));

app.delete("/api/capteurs/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    `DELETE FROM capteur WHERE idCapteur = $1 RETURNING *`, [id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Capteur non trouvé' });
  res.json({ message: 'Capteur supprimé', capteur: result.rows[0] });
}));

// == Bornes ==
app.post("/api/borne", asyncHandler(async (req, res) => {
  const { nomBorne, idSalle, idEtatBorne } = req.body;
  const result = await pool.query(
    `INSERT INTO borne (nomBorne, idSalle, idEtatBorne) VALUES ($1,$2,$3) RETURNING *`,
    [nomBorne, idSalle, idEtatBorne]
  );
  res.status(201).json(result.rows[0]);
}));

app.delete("/api/borne/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    `DELETE FROM borne WHERE idBorne = $1 RETURNING *`, [id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Borne non trouvée' });
  res.json({ message: 'Borne supprimée', borne: result.rows[0] });
}));

// == Distributeurs ==
app.post("/api/distributeurs", asyncHandler(async (req, res) => {
  const { nomDistributeur, idSalle } = req.body;
  const result = await pool.query(
    `INSERT INTO distributeur (nomDistributeur, idSalle) VALUES ($1,$2) RETURNING *`,
    [nomDistributeur, idSalle]
  );
  res.status(201).json(result.rows[0]);
}));

app.delete("/api/distributeurs/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    `DELETE FROM distributeur WHERE idDistributeur = $1 RETURNING *`, [id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Distributeur non trouvé' });
  res.json({ message: 'Distributeur supprimé', distributeur: result.rows[0] });
}));

// == Cafetières ==
app.post("/api/cafetiere", asyncHandler(async (req, res) => {
  const { nomCafetiere, idSalle, idEtat } = req.body;
  const result = await pool.query(
    `INSERT INTO cafetiere (nomCafetiere, idSalle, idEtat) VALUES ($1,$2,$3) RETURNING *`,
    [nomCafetiere, idSalle, idEtat]
  );
  res.status(201).json(result.rows[0]);
}));
app.delete("/api/cafetiere/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(`DELETE FROM cafetiere WHERE idCafetiere = $1 RETURNING *`, [id]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'Cafetière non trouvée' });
  res.json({ message: 'Cafetière supprimée', cafetiere: result.rows[0] });
}));

// == Microwaves ==
app.post("/api/microwave", asyncHandler(async (req, res) => {
  const { nomMicrowave, idSalle, idEtat } = req.body;
  const result = await pool.query(
    `INSERT INTO microwave (nomMicrowave, idSalle, idEtat) VALUES ($1,$2,$3) RETURNING *`,
    [nomMicrowave, idSalle, idEtat]
  );
  res.status(201).json(result.rows[0]);
}));
app.delete("/api/microwave/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(`DELETE FROM microwave WHERE idMicrowave = $1 RETURNING *`, [id]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'Micro-onde non trouvé' });
  res.json({ message: 'Micro-onde supprimé', microwave: result.rows[0] });
}));

// == Air Sensors ==
app.post("/api/airSensor", asyncHandler(async (req, res) => {
  const { nomAirSensor, idSalle, idEtat } = req.body;
  const result = await pool.query(
    `INSERT INTO airSensor (nomAirSensor, idSalle, idEtat) VALUES ($1,$2,$3) RETURNING *`,
    [nomAirSensor, idSalle, idEtat]
  );
  res.status(201).json(result.rows[0]);
}));
app.delete("/api/airSensor/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(`DELETE FROM airSensor WHERE idAirSensor = $1 RETURNING *`, [id]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'AirSensor non trouvé' });
  res.json({ message: 'AirSensor supprimé', airSensor: result.rows[0] });
}));

// == Dishwashers ==
app.post("/api/dishwasher", asyncHandler(async (req, res) => {
  const { nomDishwasher, idSalle, idEtat } = req.body;
  const result = await pool.query(
    `INSERT INTO dishwasher (nomDishwasher, idSalle, idEtat) VALUES ($1,$2,$3) RETURNING *`,
    [nomDishwasher, idSalle, idEtat]
  );
  res.status(201).json(result.rows[0]);
}));
app.delete("/api/dishwasher/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(`DELETE FROM dishwasher WHERE idDishwasher = $1 RETURNING *`, [id]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'Dishwasher non trouvé' });
  res.json({ message: 'Dishwasher supprimé', dishwasher: result.rows[0] });
}));

// == Ventilations ==
app.post("/api/ventilation", asyncHandler(async (req, res) => {
  const { nomVentilation, idSalle, idModes } = req.body;
  const result = await pool.query(
    `INSERT INTO ventilation (nomVentilation, idSalle, idModes) VALUES ($1,$2,$3) RETURNING *`,
    [nomVentilation, idSalle, idModes]
  );
  res.status(201).json(result.rows[0]);
}));
app.delete("/api/ventilation/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(`DELETE FROM ventilation WHERE idVentilation = $1 RETURNING *`, [id]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'Ventilation non trouvée' });
  res.json({ message: 'Ventilation supprimée', ventilation: result.rows[0] });
}));

// == Scanners ==
app.post("/api/scanner", asyncHandler(async (req, res) => {
  const { nomScanner, idSalle, idEtat } = req.body;
  const result = await pool.query(
    `INSERT INTO scanner (nomScanner, idSalle, idEtat) VALUES ($1,$2,$3) RETURNING *`,
    [nomScanner, idSalle, idEtat]
  );
  res.status(201).json(result.rows[0]);
}));
app.delete("/api/scanner/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(`DELETE FROM scanner WHERE idScanner = $1 RETURNING *`, [id]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'Scanner non trouvé' });
  res.json({ message: 'Scanner supprimé', scanner: result.rows[0] });
}));

// == Affichages ==
app.post("/api/affichage", asyncHandler(async (req, res) => {
  const { nomAffichage, idSalle, idEtat } = req.body;
  const result = await pool.query(
    `INSERT INTO affichage (nomAffichage, idSalle, idEtat) VALUES ($1,$2,$3) RETURNING *`,
    [nomAffichage, idSalle, idEtat]
  );
  res.status(201).json(result.rows[0]);
}));
app.delete("/api/affichage/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(`DELETE FROM affichage WHERE idAffichage = $1 RETURNING *`, [id]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'Affichage non trouvé' });
  res.json({ message: 'Affichage supprimé', affichage: result.rows[0] });
}));

// == Barrières ==
app.post("/api/barriere", asyncHandler(async (req, res) => {
  const { nomBarriere, idSalle, idEtat } = req.body;
  const result = await pool.query(
    `INSERT INTO barriere (nomBarriere, idSalle, idEtat) VALUES ($1,$2,$3) RETURNING *`,
    [nomBarriere, idSalle, idEtat]
  );
  res.status(201).json(result.rows[0]);
}));
app.delete("/api/barriere/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(`DELETE FROM barriere WHERE idBarriere = $1 RETURNING *`, [id]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'Barrière non trouvée' });
  res.json({ message: 'Barrière supprimée', barriere: result.rows[0] });
}));

// == Hottes ==
app.post("/api/hotte", asyncHandler(async (req, res) => {
  const { nomHotte, idSalle, idEtat } = req.body;
  const result = await pool.query(
    `INSERT INTO hotte (nomHotte, idSalle, idEtat) VALUES ($1,$2,$3) RETURNING *`,
    [nomHotte, idSalle, idEtat]
  );
  res.status(201).json(result.rows[0]);
}));
app.delete("/api/hotte/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(`DELETE FROM hotte WHERE idHotte = $1 RETURNING *`, [id]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'Hotte non trouvée' });
  res.json({ message: 'Hotte supprimée', hotte: result.rows[0] });
}));

// == Panneaux ==
app.post("/api/panneau", asyncHandler(async (req, res) => {
  const { nomPanneau } = req.body;
  const result = await pool.query(
    `INSERT INTO panneau (nomPanneau) VALUES ($1) RETURNING *`,
    [nomPanneau]
  );
  res.status(201).json(result.rows[0]);
}));
app.delete("/api/panneau/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(`DELETE FROM panneau WHERE idPanneau = $1 RETURNING *`, [id]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'Panneau non trouvé' });
  res.json({ message: 'Panneau supprimé', panneau: result.rows[0] });
}));

// == Alarmes ==
app.post("/api/alarme", asyncHandler(async (req, res) => {
  const { nomAlarme } = req.body;
  const result = await pool.query(
    `INSERT INTO alarme (nomAlarme) VALUES ($1) RETURNING *`,
    [nomAlarme]
  );
  res.status(201).json(result.rows[0]);
}));
app.delete("/api/alarme/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(`DELETE FROM alarme WHERE idAlarme = $1 RETURNING *`, [id]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'Alarme non trouvée' });
  res.json({ message: 'Alarme supprimée', alarme: result.rows[0] });
}));

// PATCH routes to update states for all entities
// Assumes you have `app` (Express), `pool` (pg Pool), and `asyncHandler` helper configured

// == Salles ==
app.patch("/api/salles/:id", asyncHandler(async (req, res) => {
  const { idEtatSalle } = req.body;
  const { id } = req.params;
  const result = await pool.query(
    `UPDATE salle SET idEtatSalle = $1 WHERE idSalle = $2 RETURNING *`,
    [idEtatSalle, id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Salle non trouvée' });
  res.json(result.rows[0]);
}));

// == Projecteurs ==
app.patch("/api/projecteurs/:id", asyncHandler(async (req, res) => {
  const { idEtat } = req.body;
  const { id } = req.params;
  const result = await pool.query(
    `UPDATE projecteur SET idEtat = $1 WHERE idProjecteur = $2 RETURNING *`,
    [idEtat, id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Projecteur non trouvé' });
  res.json(result.rows[0]);
}));

// == Chauffages ==
app.patch("/api/chauffages/:id", asyncHandler(async (req, res) => {
  const { idEtat, temperature } = req.body;
  const { id } = req.params;
  const result = await pool.query(
    `UPDATE chauffage SET idEtat = $1, temperature = COALESCE($2, temperature) WHERE idChauffage = $3 RETURNING *`,
    [idEtat, temperature, id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Chauffage non trouvé' });
  res.json(result.rows[0]);
}));

// == Éclairages ==
app.patch("/api/eclairages/:id", asyncHandler(async (req, res) => {
  const { idEtat } = req.body;
  const { id } = req.params;
  const result = await pool.query(
    `UPDATE eclairage SET idEtat = $1 WHERE idEclairage = $2 RETURNING *`,
    [idEtat, id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Éclairage non trouvé' });
  res.json(result.rows[0]);
}));

// == Stores ==
app.patch("/api/stores/:id", asyncHandler(async (req, res) => {
  const { idEtat, ouverture } = req.body;
  const { id } = req.params;
  const result = await pool.query(
    `UPDATE store SET idEtat = $1, ouverture = COALESCE($2, ouverture) WHERE idStore = $3 RETURNING *`,
    [idEtat, ouverture, id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Store non trouvé' });
  res.json(result.rows[0]);
}));

// == Audio ==
app.patch("/api/sysAudio/:id", asyncHandler(async (req, res) => {
  const { idEtat, puissance } = req.body;
  const { id } = req.params;
  const result = await pool.query(
    `UPDATE sysAudio SET idEtat = $1, puissance = COALESCE($2, puissance) WHERE idAudio = $3 RETURNING *`,
    [idEtat, puissance, id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Audio non trouvé' });
  res.json(result.rows[0]);
}));

// == Grilles ==
app.patch("/api/grilles/:id", asyncHandler(async (req, res) => {
  const { idEtat } = req.body;
  const { id } = req.params;
  const result = await pool.query(
    `UPDATE grille SET idEtat = $1 WHERE idGrille = $2 RETURNING *`,
    [idEtat, id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Grille non trouvée' });
  res.json(result.rows[0]);
}));

// == Cameras ==
app.patch("/api/cameras/:id", asyncHandler(async (req, res) => {
  const { idEtat } = req.body;
  const { id } = req.params;
  const result = await pool.query(
    `UPDATE camera SET idEtat = $1 WHERE idCamera = $2 RETURNING *`,
    [idEtat, id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Caméra non trouvée' });
  res.json(result.rows[0]);
}));

// == Portes ==
app.patch("/api/portes/:id", asyncHandler(async (req, res) => {
  const { idEtat } = req.body;
  const { id } = req.params;
  const result = await pool.query(
    `UPDATE porte SET idEtat = $1 WHERE idPorte = $2 RETURNING *`,
    [idEtat, id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Porte non trouvée' });
  res.json(result.rows[0]);
}));

// == Capteurs ==
app.patch("/api/capteurs/:id", asyncHandler(async (req, res) => {
  const { idEtat } = req.body;
  const { id } = req.params;
  const result = await pool.query(
    `UPDATE capteur SET idEtat = $1 WHERE idCapteur = $2 RETURNING *`,
    [idEtat, id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Capteur non trouvé' });
  res.json(result.rows[0]);
}));

// == Bornes ==
app.patch("/api/borne/:id", asyncHandler(async (req, res) => {
  const { idEtatBorne } = req.body;
  const { id } = req.params;
  const result = await pool.query(
    `UPDATE borne SET idEtatBorne = $1 WHERE idBorne = $2 RETURNING *`,
    [idEtatBorne, id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Borne non trouvée' });
  res.json(result.rows[0]);
}));

// == Cafetières ==
app.patch("/api/cafetiere/:id", asyncHandler(async (req, res) => {
  const { idEtat } = req.body;
  const { id } = req.params;
  const result = await pool.query(
    `UPDATE cafetiere SET idEtat = $1 WHERE idCafetiere = $2 RETURNING *`,
    [idEtat, id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Cafetière non trouvée' });
  res.json(result.rows[0]);
}));

// == Microwaves ==
app.patch("/api/microwave/:id", asyncHandler(async (req, res) => {
  const { idEtat } = req.body;
  const { id } = req.params;
  const result = await pool.query(
    `UPDATE microwave SET idEtat = $1 WHERE idMicrowave = $2 RETURNING *`,
    [idEtat, id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Micro-onde non trouvé' });
  res.json(result.rows[0]);
}));

// == Air Sensors ==
app.patch("/api/airSensor/:id", asyncHandler(async (req, res) => {
  const { idEtat } = req.body;
  const { id } = req.params;
  const result = await pool.query(
    `UPDATE airSensor SET idEtat = $1 WHERE idAirSensor = $2 RETURNING *`,
    [idEtat, id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'AirSensor non trouvé' });
  res.json(result.rows[0]);
}));

// == Dishwashers ==
app.patch("/api/dishwasher/:id", asyncHandler(async (req, res) => {
  const { idEtat } = req.body;
  const { id } = req.params;
  const result = await pool.query(
    `UPDATE dishwasher SET idEtat = $1 WHERE idDishwasher = $2 RETURNING *`,
    [idEtat, id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Dishwasher non trouvé' });
  res.json(result.rows[0]);
}));

// == Ventilations ==
app.patch("/api/ventilation/:id", asyncHandler(async (req, res) => {
  const { idModes } = req.body;
  const { id } = req.params;
  const result = await pool.query(
    `UPDATE ventilation SET idModes = $1 WHERE idVentilation = $2 RETURNING *`,
    [idModes, id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Ventilation non trouvée' });
  res.json(result.rows[0]);
}));

// == Scanners ==
app.patch("/api/scanner/:id", asyncHandler(async (req, res) => {
  const { idEtat } = req.body;
  const { id } = req.params;
  const result = await pool.query(
    `UPDATE scanner SET idEtat = $1 WHERE idScanner = $2 RETURNING *`,
    [idEtat, id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Scanner non trouvé' });
  res.json(result.rows[0]);
}));

// == Affichages ==
app.patch("/api/affichage/:id", asyncHandler(async (req, res) => {
  const { idEtat } = req.body;
  const { id } = req.params;
  const result = await pool.query(
    `UPDATE affichage SET idEtat = $1 WHERE idAffichage = $2 RETURNING *`,
    [idEtat, id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Affichage non trouvé' });
  res.json(result.rows[0]);
}));

// == Barrières ==
app.patch("/api/barriere/:id", asyncHandler(async (req, res) => {
  const { idEtat } = req.body;
  const { id } = req.params;
  const result = await pool.query(
    `UPDATE barriere SET idEtat = $1 WHERE idBarriere = $2 RETURNING *`,
    [idEtat, id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Barrière non trouvée' });
  res.json(result.rows[0]);
}));

// == Hottes ==
app.patch("/api/hotte/:id", asyncHandler(async (req, res) => {
  const { idEtat } = req.body;
  const { id } = req.params;
  const result = await pool.query(
    `UPDATE hotte SET idEtat = $1 WHERE idHotte = $2 RETURNING *`,
    [idEtat, id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Hotte non trouvée' });
  res.json(result.rows[0]);
}));





// -------------------------
// WebSockets
// -------------------------
io.on("connection", (socket) => {
  console.log("Nouvel utilisateur connecté 🔗");
  socket.on("disconnect", () => console.log("Utilisateur déconnecté ❌"));
});

// -------------------------
// Servir le frontend
// -------------------------
// On sert les fichiers statiques du dossier "build" généré par votre application frontend.
app.use(express.static(path.join(__dirname, 'build')));

// Pour toute route non gérée par les routes API, renvoie le fichier index.html du build.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// -------------------------
// Démarrage du serveur
// -------------------------
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`✅ Serveur sur http://localhost:${PORT}`));