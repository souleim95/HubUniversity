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
// Helper to handle async errors
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

async function logAction(userId, action, details) {
  try {
    await pool.query(
      `INSERT INTO action_history (user_id, action, details)
       VALUES ($1, $2, $3)`,
      [userId, action, details]
    );
  } catch (err) {
    // Si err.code === '23503' (viol. FK), on l’ignore
    console.warn('logAction échoué (FK):', err.message);
  }
}



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

app.use((req, res, next) => {
  console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log('  Params :', req.params);
  console.log('  Body   :', req.body);
  next();
});

pool.connect()
  .then(() => console.log("✅ Connexion PostgreSQL réussie"))
  .catch(err => console.error("❌ Erreur de connexion à PostgreSQL :", err));

// -------------------------
// Routes API (backend)
// -------------------------

// Route de test de l'API
app.get("/api", (req, res) => res.send("Backend API is running 🚀"));


app.get('/api/users', async (req, res) => {
     try {
       const { rows } = await pool.query(`
         SELECT
           u.id,
           u.pseudonyme   AS login,
           u.email,
           COALESCE(u.score, 0)   AS points,
           u.created_at   AS inscription,
           u.last_login   AS last_login,
           r.nomRole      AS role
         FROM users u
         LEFT JOIN role r ON u.idRole = r.idRole
         ORDER BY u.id
       `);
       res.json(rows);
     } catch (err) {
       console.error(err);
       res.status(500).json({ error: 'Erreur serveur' });
    }
  });

app.get("/api/users/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT id, nom, prenom, email, pseudonyme, genre, formation, dateNaissance
    FROM users
    WHERE id = $1
  `;
  const { rows } = await pool.query(query, [id]);
  if (rows.length === 0) {
    return res.status(404).json({ error: "Utilisateur non trouvé." });
  }
  res.json(rows[0]);
}));

// Route pour récupérer les utilisateurs avec leur rôle
// app.get("/api/users", async (req, res) => {
//   try {
//     const query = `
//         SELECT 
//           u.id,
//           u.name,
//           u.email,
//           COALESCE(u.score, 0) AS score,
//           r.nomRole AS role,
//           u.created_at,
//           u.last_login
//         FROM users u
//         JOIN role r ON u.idRole = r.idRole
//         ORDER BY u.id
//       `;
//     const { rows } = await pool.query(query);
//     res.json(rows);
//   } catch (err) {
//     console.error("Erreur de récupération des utilisateurs :", err);
//     res.status(500).send("Erreur serveur");
//   }
// });

app.post("/api/users", async (req, res) => {
  const {
    nom,
    prenom,
    email,
    role,
    password,
    genre,
    score,
    pseudonyme,
    formation,
    last_login,
    dateNaissance
  } = req.body;

  // Vérification précise des champs obligatoires
  const missingFields = [];
  if (!nom) missingFields.push("nom");
  if (!prenom) missingFields.push("prenom");
  if (!email) missingFields.push("email");
  if (!role) missingFields.push("role");
  if (!password) missingFields.push("password");
  if (!pseudonyme) missingFields.push("pseudonyme");
  if (!formation) missingFields.push("formation");
  if (!dateNaissance) missingFields.push("dateNaissance");

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Les champs suivants sont obligatoires et manquants : ${missingFields.join(", ")}.`
    });
  }

  try {
    // 1. Vérification du rôle
    const roleResult = await pool.query(
      "SELECT idRole FROM role WHERE nomRole ILIKE $1",
      [role]
    );
    if (roleResult.rows.length === 0) {
      return res.status(400).json({ error: `Le rôle '${role}' est invalide ou inexistant.` });
    }

    const idRole = roleResult.rows[0].idrole || roleResult.rows[0].idRole;

    // 2. Hachage du mot de passe
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 3. Insertion utilisateur
    const insertQuery = `
      INSERT INTO users (
        nom, prenom, email, idRole, password,
        genre, score, pseudonyme, formation,
        last_login, dateNaissance
      ) VALUES (
        $1, $2, $3, $4,
        $5, $6, $7, $8,
        $9, $10, $11
      ) RETURNING *
    `;


    const insertValues = [
      nom,
      prenom,
      email,
      idRole,
      passwordHash,
      genre || null,
      score || 0,
      pseudonyme,
      formation,
      last_login || null,
      dateNaissance
    ];

    const insertResult = await pool.query(insertQuery, insertValues);
    const newUser = insertResult.rows[0];

    // 4. Réponse sans mot de passe
    res.status(201).json({
      message: "Utilisateur créé avec succès.",
      user: {
        id: newUser.id,
        nom: newUser.nom,
        email: newUser.email,
        role: role,
        genre: newUser.genre,
        score: newUser.score,
        pseudonyme: newUser.pseudonyme,
        formation: newUser.formation,
        last_login: newUser.last_login,
        dateNaissance: newUser.datenaissance,
        created_at: newUser.created_at
      }
    });

  } catch (err) {
    console.error("Erreur lors de la création de l'utilisateur :", err);
    if (err.code === '23505') {
      return res.status(400).json({ error: "L'adresse e-mail est déjà utilisée." });
    }
    res.status(500).json({ error: "Erreur interne du serveur. Veuillez réessayer plus tard." });
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
      SELECT u.id, u.nom, u.prenom, u.email, u.password, u.pseudonyme, COALESCE(u.score, 0) as score, r.nomRole as role
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
      await pool.query(
            `UPDATE users
               SET last_login = NOW()
             WHERE id = $1`,
            [user.id]
          );
      await logAction(user.id, "Connexion", `Connexion de ${user.email}`); 
      // On renvoie l'objet utilisateur sans le mot de passe.
      res.json({ 
        message: "Connexion réussie", 
        user: { 
          id: user.id, 
          nom: user.nom, 
          prenom : user.prenom,
          pseudonyme : user.pseudonyme,
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

app.patch('/users/:id/email', async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;
  try {
    const result = await pool.query(`
      UPDATE users SET email = $1 WHERE id = $2 RETURNING email
    `, [email, id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur mise à jour email' });
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
    if (score >= 500) {
      newRole = 'directeur';
    } else if (score >= 200) {
      newRole = 'professeur';
    }
    
    if (newRole) {
      // Mettre à jour le rôle dans la base de données
      await pool.query(`
        UPDATE users 
        SET idrole = (SELECT idRole FROM role WHERE nomRole ILIKE $1) 
        WHERE id = $2
      `, [newRole, id]);
    }
    await logAction(id, "Modification", `Points mis à jour de ${increment} pour l'utilisateur ${id}`);
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

app.delete('/api/users/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  // 1) Récupérer l’utilisateur
  const { rows: [user] } = await pool.query(
    'SELECT id, email FROM users WHERE id = $1',
    [id]
  );
  if (!user) {
    return res.status(404).json({ error: 'Utilisateur non trouvé.' });
  }
  // 2) Journaliser la suppression
  // 3) Supprimer réellement
  const { rows: [deletedUser] } = await pool.query(
    'DELETE FROM users WHERE id = $1 RETURNING *',
    [id]
  );
  res.json({ message: 'Utilisateur supprimé.', user: deletedUser });
}));


// server.js, après app.post("/api/users")…
// server.js (ou dans ton router users.js)
app.patch('/api/users/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    role,
    score,
    nom,
    prenom,
    email,
    pseudonyme,
    genre,
    formation,
    dateNaissance,
    oldPassword,
    newPassword,
    confirmNewPassword
  } = req.body;

  // 1) Gestion du changement de mot de passe (si présent)
  if (oldPassword || newPassword || confirmNewPassword) {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ error: 'Tous les champs de mot de passe sont requis.' });
    }
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ error: 'Les nouveaux mots de passe ne correspondent pas.' });
    }
    // Récupère le hash existant
    const { rows: userRows } = await pool.query(
      'SELECT password_hash FROM users WHERE id = $1',
      [id]
    );
    if (!userRows.length) {
      return res.status(404).json({ error: 'Utilisateur introuvable.' });
    }
    const match = await bcrypt.compare(oldPassword, userRows[0].password_hash);
    if (!match) {
      return res.status(400).json({ error: 'Ancien mot de passe incorrect.' });
    }
    // Hashe et met à jour
    const newHash = await bcrypt.hash(newPassword, 12);
    await pool.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [newHash, id]
    );
  }

  // 2) Construction dynamique des autres champs à mettre à jour
  const sets = [];
  const values = [];
  let idx = 1;
  console.log('→ Role  0  :', role);
  // Si un rôle a été fourni, on le valide et on l'ajoute
  if (role !== undefined) {
    const { rows: roleRows } = await pool.query(
      'SELECT idRole FROM role WHERE LOWER(nomRole) = LOWER($1)',
      [role]
    );
    console.log('→ roleRows :', roleRows);
    if (!roleRows.length) {
      return res.status(400).json({ error: `Rôle invalide : ${role}` });
    }
    sets.push(`idRole = $${idx++}`);
    values.push(roleRows[0].idrole);
    console.log('→ Role  4 :', role);
    console.log('→ Valeurs initiale  :', values);

  }

  // Si un score a été fourni
  if (score !== undefined) {
    sets.push(`score = $${idx++}`);
    values.push(score);
  }

  // Pour tous les autres champs de profil
  if (nom !== undefined)          { sets.push(`nom = $${idx++}`); values.push(nom); }
  if (prenom !== undefined)       { sets.push(`prenom = $${idx++}`); values.push(prenom); }
  if (email !== undefined)        { sets.push(`email = $${idx++}`); values.push(email); }
  if (pseudonyme !== undefined)   { sets.push(`pseudonyme = $${idx++}`); values.push(pseudonyme); }
  if (genre !== undefined)        { sets.push(`genre = $${idx++}`); values.push(genre); }
  if (formation !== undefined)    { sets.push(`formation = $${idx++}`); values.push(formation); }
  if (dateNaissance !== undefined){ sets.push(`dateNaissance = $${idx++}`); values.push(dateNaissance); }
  // Si au moins un champ à mettre à jour
  if (sets.length > 0) {
    // On ajoute l'id en dernier paramètre
    values.push(id);
    const sql = `
      UPDATE users
         SET ${sets.join(', ')}
       WHERE id = $${idx}
       RETURNING id, nom, prenom, email, idRole, pseudonyme, genre, formation, dateNaissance, score
    `;
    console.log('→ SQL Update :', sql);
    console.log('→ Valeurs finale   :', values);
    console.log('→ Role  finale :', role);
    const { rows } = await pool.query(sql, values);
    console.log('← Résultat   :', rows);
    const updated = rows[0];
    return res.json({
      message: 'Profil mis à jour avec succès.',
      user: {
        ...updated,
        role   // on renvoie le nom du rôle en clair si fourni
      }
    });
  }

  // Si rien à mettre à jour
  res.status(400).json({ error: 'Aucune donnée à mettre à jour.' });
}));


app.get('/api/users/:id/password', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { oldPassword } = req.query;

  if (!oldPassword) {
    return res.status(400).json({ error: 'oldPassword manquant en query.' });
  }

  // 1) Récupère le hash stocké
  const { rows } = await pool.query(
    'SELECT password FROM users WHERE id = $1',
    [id]
  );
  if (rows.length === 0) {
    return res.status(404).json({ error: 'Utilisateur non trouvé.' });
  }
  const storedHash = rows[0].password;

  // 2) Compare l’ancien mot de passe
  const match = await bcrypt.compare(oldPassword, storedHash);

  // 3) Renvoyer le résultat
  res.json({ match });
}));


/**
 * PATCH /api/users/:id/password
 * Permet de modifier le mot de passe SI et SEULEMENT SI oldPassword est correct.
 * Body attendu : { oldPassword, newPassword, confirmNewPassword }
 */
app.patch('/api/users/:id/password', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword, confirmNewPassword } = req.body;

  // 1) Vérifications de base
  if (!oldPassword || !newPassword || !confirmNewPassword) {
    return res.status(400).json({ error: 'oldPassword, newPassword et confirmNewPassword sont obligatoires.' });
  }
  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ error: 'Les nouveaux mots de passe ne correspondent pas.' });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caractères.' });
  }

  // 2) Récupère le hash actuel
  const { rows } = await pool.query(
    'SELECT password FROM users WHERE id = $1',
    [id]
  );
  if (rows.length === 0) {
    return res.status(404).json({ error: 'Utilisateur non trouvé.' });
  }
  const currentHash = rows[0].password;

  // 3) Vérifie l’ancien mot de passe
  const valid = await bcrypt.compare(oldPassword, currentHash);
  if (!valid) {
    return res.status(400).json({ error: 'Ancien mot de passe incorrect.' });
  }

  // 4) Hash et mise à jour du nouveau mot de passe
  const newHash = await bcrypt.hash(newPassword, 10);
  await pool.query(
    'UPDATE users SET password = $1 WHERE id = $2',
    [newHash, id]
  );

  // 5) Répondre OK
  res.json({ ok: true, message: 'Mot de passe mis à jour avec succès.' });
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
      m.nomModes      AS mode
    FROM chauffage c
    LEFT JOIN modes m    ON c.idModes = m.idModes

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
      'sysaudio' AS type,
      a.idAudio  AS id,
      a.nomAudio AS nom,
      e.nomEtat  AS etat
    FROM sysaudio a
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
    LEFT JOIN etat e      ON p.idEtat = e.idEtat

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

// server.js, après app.get("/api/objets")…
app.post("/api/objets", asyncHandler(async (req, res) => {
  const { type, nom } = req.body;
  const t = type.toLowerCase();

  let sql, values;
  switch(t) {
    case 'projecteur':
      sql    = 'INSERT INTO projecteur (nomProjecteur) VALUES ($1) RETURNING idProjecteur AS id, nomProjecteur AS nom';
      values = [nom];
      break;
    case 'chauffage':
      sql    = 'INSERT INTO chauffage (nomChauffage) VALUES ($1) RETURNING idChauffage AS id, nomChauffage AS nom';
      values = [nom];
      break;
    case 'eclairage':
      sql    = 'INSERT INTO eclairage (nomEclairage) VALUES ($1) RETURNING idEclairage AS id, nomEclairage AS nom';
      values = [nom];
      break;
    case 'store':
      sql    = 'INSERT INTO store (nomStore) VALUES ($1) RETURNING idStore AS id, nomStore AS nom';
      values = [nom];
      break;
    case 'sysaudio':
      sql    = 'INSERT INTO sysaudio (nomAudio) VALUES ($1) RETURNING idAudio AS id, nomAudio AS nom';
      values = [nom];
      break;
    case 'grille':
      sql    = 'INSERT INTO grille (nomGrille) VALUES ($1) RETURNING idGrille AS id, nomGrille AS nom';
      values = [nom];
      break;
    case 'camera':
      sql    = 'INSERT INTO camera (nomCamera) VALUES ($1) RETURNING idCamera AS id, nomCamera AS nom';
      values = [nom];
      break;
    case 'porte':
      sql    = 'INSERT INTO porte (nomPorte) VALUES ($1) RETURNING idPorte AS id, nomPorte AS nom';
      values = [nom];
      break;
    case 'capteur':
      sql    = 'INSERT INTO capteur (nomCapteur) VALUES ($1) RETURNING idCapteur AS id, nomCapteur AS nom';
      values = [nom];
      break;
    case 'borne':
      sql    = 'INSERT INTO borne (nomBorne) VALUES ($1) RETURNING idBorne AS id, nomBorne AS nom';
      values = [nom];
      break;
    case 'distributeur':
      sql    = 'INSERT INTO distributeur (nomDistributeur) VALUES ($1) RETURNING idDistributeur AS id, nomDistributeur AS nom';
      values = [nom];
      break;
    case 'cafetiere':
      sql    = 'INSERT INTO cafetiere (nomCafetiere) VALUES ($1) RETURNING idCafetiere AS id, nomCafetiere AS nom';
      values = [nom];
      break;
    case 'microwave':
      sql    = 'INSERT INTO microwave (nomMicrowave) VALUES ($1) RETURNING idMicrowave AS id, nomMicrowave AS nom';
      values = [nom];
      break;
    case 'airsensor':
      sql    = 'INSERT INTO airSensor (nomAirSensor) VALUES ($1) RETURNING idAirSensor AS id, nomAirSensor AS nom';
      values = [nom];
      break;
    case 'dishwasher':
      sql    = 'INSERT INTO dishwasher (nomDishwasher) VALUES ($1) RETURNING idDishwasher AS id, nomDishwasher AS nom';
      values = [nom];
      break;
    case 'ventilation':
      sql    = 'INSERT INTO ventilation (nomVentilation) VALUES ($1) RETURNING idVentilation AS id, nomVentilation AS nom';
      values = [nom];
      break;
    case 'scanner':
      sql    = 'INSERT INTO scanner (nomScanner) VALUES ($1) RETURNING idScanner AS id, nomScanner AS nom';
      values = [nom];
      break;
    case 'affichage':
      sql    = 'INSERT INTO affichage (nomAffichage) VALUES ($1) RETURNING idAffichage AS id, nomAffichage AS nom';
      values = [nom];
      break;
    case 'barriere':
      sql    = 'INSERT INTO barriere (nomBarriere) VALUES ($1) RETURNING idBarriere AS id, nomBarriere AS nom';
      values = [nom];
      break;
    case 'hotte':
      sql    = 'INSERT INTO hotte (nomHotte) VALUES ($1) RETURNING idHotte AS id, nomHotte AS nom';
      values = [nom];
      break;
    case 'panneau':
      sql    = 'INSERT INTO panneau (nomPanneau) VALUES ($1) RETURNING idPanneau AS id, nomPanneau AS nom';
      values = [nom];
      break;
    case 'alarme':
      sql    = 'INSERT INTO alarme (nomAlarme) VALUES ($1) RETURNING idAlarme AS id, nomAlarme AS nom';
      values = [nom];
      break;
    case 'salle':
      sql    = 'INSERT INTO salle (nomSalle) VALUES ($1) RETURNING idSalle AS id, nomSalle AS nom';
      values = [nom];
      break;
    default:
      return res.status(400).json({ error: `Type inconnu : ${type}` }); 
  }
const { rows } = await pool.query(sql, values);
res.status(201).json({ type, id: rows[0].id, nom: rows[0].nom, etat: null });
}));

app.get("/api/salles/:id/objets", asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Requête SQL qui fait l'union de tous les objets possédant une colonne idSalle
  const query = `
    -- Projecteurs
    SELECT
      'projecteur'    AS type,
      p.idProjecteur  AS id,
      p.nomProjecteur AS nom,
      p.idEtat        AS etat
    FROM projecteur p
    WHERE p.idSalle = $1

    UNION ALL

    -- Chauffages
    SELECT
      'chauffage'     AS type,
      c.idChauffage   AS id,
      c.nomChauffage  AS nom,
      c.idModes        AS mode
    FROM chauffage c
    WHERE c.idSalle = $1

    UNION ALL

    -- Éclairages
    SELECT
      'eclairage'     AS type,
      e.idEclairage   AS id,
      e.nomEclairage  AS nom,
      e.idEtat        AS etat
    FROM eclairage e
    WHERE e.idSalle = $1

    UNION ALL

    -- Stores
    SELECT
      'store'         AS type,
      s.idStore       AS id,
      s.nomStore      AS nom,
      s.idEtat        AS etat
    FROM store s
    WHERE s.idSalle = $1

    UNION ALL

    -- Systèmes Audio
    SELECT
      'sysaudio'      AS type,
      a.idAudio       AS id,
      a.nomAudio      AS nom,
      a.idEtat        AS etat
    FROM sysaudio a
    WHERE a.idSalle = $1

    UNION ALL

    -- Grilles
    SELECT
      'grille'        AS type,
      g.idGrille      AS id,
      g.nomGrille     AS nom,
      g.idEtat        AS etat
    FROM grille g
    WHERE g.idSalle = $1

    UNION ALL

    -- Caméras
    SELECT
      'camera'        AS type,
      cam.idCamera    AS id,
      cam.nomCamera   AS nom,
      cam.idEtat      AS etat
    FROM camera cam
    WHERE cam.idSalle = $1

    UNION ALL

    -- Portes
    SELECT
      'porte'         AS type,
      p.idPorte       AS id,
      p.nomPorte      AS nom,
      p.idEtat AS etat
    FROM porte p
    WHERE p.idSalle = $1

    UNION ALL

    -- Capteurs
    SELECT
      'capteur'       AS type,
      cap.idCapteur   AS id,
      cap.nomCapteur  AS nom,
      cap.idEtat      AS etat
    FROM capteur cap
    WHERE cap.idSalle = $1

    UNION ALL

    -- Bornes
    SELECT
      'borne'         AS type,
      b.idBorne       AS id,
      b.nomBorne      AS nom,
      b.idEtatBorne   AS etat
    FROM borne b
    WHERE b.idSalle = $1

    UNION ALL

    -- Distributeurs
    SELECT
      'distributeur'  AS type,
      d.idDistributeur AS id,
      d.nomDistributeur AS nom,
      d.idEtat        AS etat
    FROM distributeur d
    WHERE d.idSalle = $1

    UNION ALL

    -- Cafetières
    SELECT
      'cafetiere'     AS type,
      cf.idCafetiere  AS id,
      cf.nomCafetiere AS nom,
      cf.idEtat       AS etat
    FROM cafetiere cf
    WHERE cf.idSalle = $1

    UNION ALL

    -- Micro-ondes
    SELECT
      'microwave'     AS type,
      m.idMicrowave   AS id,
      m.nomMicrowave  AS nom,
      m.idEtat        AS etat
    FROM microwave m
    WHERE m.idSalle = $1

    UNION ALL

    -- AirSensors
    SELECT
      'airSensor'     AS type,
      a.idAirSensor   AS id,
      a.nomAirSensor  AS nom,
      a.idEtat        AS etat
    FROM airSensor a
    WHERE a.idSalle = $1

    UNION ALL

    -- Lave-vaisselles
    SELECT
      'dishwasher'    AS type,
      d.idDishwasher  AS id,
      d.nomDishwasher AS nom,
      d.idEtat        AS etat
    FROM dishwasher d
    WHERE d.idSalle = $1

    UNION ALL

    -- Ventilations
    SELECT
      'ventilation'   AS type,
      v.idVentilation AS id,
      v.nomVentilation AS nom,
      v.idModes       AS mode
    FROM ventilation v
    WHERE v.idSalle = $1

    UNION ALL

    -- Scanners
    SELECT
      'scanner'       AS type,
      s.idScanner     AS id,
      s.nomScanner    AS nom,
      s.idEtat        AS etat
    FROM scanner s
    WHERE s.idSalle = $1

    UNION ALL

    -- Affichages
    SELECT
      'affichage'     AS type,
      a.idAffichage   AS id,
      a.nomAffichage  AS nom,
      a.idEtat        AS etat
    FROM affichage a
    WHERE a.idSalle = $1

    UNION ALL

    -- Barrières
    SELECT
      'barriere'      AS type,
      b.idBarriere    AS id,
      b.nomBarriere   AS nom,
      b.idEtat        AS etat
    FROM barriere b
    WHERE b.idSalle = $1

    UNION ALL

    -- Hottes
    SELECT
      'hotte'         AS type,
      h.idHotte       AS id,
      h.nomHotte      AS nom,
      h.idEtat        AS etat
    FROM hotte h
    WHERE h.idSalle = $1
  `;

  const { rows } = await pool.query(query, [id]);
  res.json(rows);
}));

// Récupérer l'historique des actions depuis la BDD
app.get('/api/action-history', asyncHandler(async (req, res) => {
  const query = `
    SELECT 
      ah.id,
      ah.user_id AS "userId",
      u.nom     AS "nom",
      ah.action,
      ah.details,
      ah.timestamp
    FROM action_history ah
    LEFT JOIN users u ON u.id = ah.user_id
    ORDER BY ah.timestamp DESC
  `;
  const { rows } = await pool.query(query);
  res.json(rows);
}));

const resources = {
  salle:        { pk: 'idSalle',       fields: ['nomSalle',       'idEtatSalle'] },
  projecteur:   { pk: 'idProjecteur',  fields: ['nomProjecteur',"idSalle", 'idEtat'] },
  chauffage:    { pk: 'idChauffage',   fields: ['nomChauffage', "idSalle",  'idEtat', 'idModes'] },
  eclairage:    { pk: 'idEclairage',   fields: ['nomEclairage', "idSalle",  'idEtat'] },
  store:        { pk: 'idStore',       fields: ['nomStore',    "idSalle",   'idEtat'] },
  sysaudio:     { pk: 'idAudio',       fields: ['nomAudio',   "idSalle",    'idEtat'] },
  grille:       { pk: 'idGrille',      fields: ['nomGrille',  "idSalle",    'idEtat'] },
  camera:       { pk: 'idCamera',      fields: ['nomCamera',   "idSalle",   'idEtat'] },
  porte:        { pk: 'idPorte',       fields: ['nomPorte',   "idSalle",    'idEtat'] },
  capteur:      { pk: 'idCapteur',     fields: ['nomCapteur', "idSalle",    'idEtat'] },
  borne:        { pk: 'idBorne',       fields: ['nomBorne',    "idSalle",   'idEtatBorne'] },
  distributeur: { pk: 'idDistributeur',fields: ['nomDistributeur',"idSalle",'idEtat'] },
  cafetiere:    { pk: 'idCafetiere',   fields: ['nomCafetiere', "idSalle",  'idEtat'] },
  microwave:    { pk: 'idMicrowave',   fields: ['nomMicrowave', "idSalle",  'idEtat'] },
  airSensor:    { pk: 'idAirSensor',   fields: ['nomAirSensor', "idSalle",  'idEtat'] },
  dishwasher:   { pk: 'idDishwasher',  fields: ['nomDishwasher', "idSalle", 'idEtat'] },
  ventilation:  { pk: 'idVentilation', fields: ['nomVentilation',"idSalle", "idEtat", 'idModes'] },
  scanner:      { pk: 'idScanner',     fields: ['nomScanner',  "idSalle",   'idEtat'] },
  affichage:    { pk: 'idAffichage',   fields: ['nomAffichage', "idSalle",  'idEtat'] },
  barriere:     { pk: 'idBarriere',    fields: ['nomBarriere',  "idSalle",  'idEtat'] },
  hotte:        { pk: 'idHotte',       fields: ['nomHotte',     "idSalle",  'idEtat'] },
  panneau:      { pk: 'idPanneau',     fields: ['nomPanneau',  "idSalle",   'idEtat'] },
  borne:        { pk : 'idBorne',      fields: ["nomBorne", "idSalle" ,"idEtatBorne"]},
  alarme:       { pk: 'idAlarme',      fields: ['nomAlarme',   "idSalle",   'idEtat'] },
};
//reste bornes et un autre truc aussi 

// Journaliser la déconnexion
app.post('/api/logout', asyncHandler(async (req, res) => {
  console.log('🛎️ POST /api/logout — req.body =', req.body);
  
  const { userId } = req.body;
  if (!userId) {
    console.error('❌ userId manquant dans /api/logout');
    return res.status(400).json({ error: 'userId manquant' });
  }

  await logAction(userId, 'Déconnexion', `Déconnexion de l'utilisateur ${userId}`);
  res.json({ message: 'Déconnexion enregistrée' });
}));
app.get("/api/:resource/:id", asyncHandler(async (req, res, next) => {
  const { resource, id } = req.params;

  const cfg = resources[resource];
  if (!cfg) {
    return res.status(400).json({ error: `Ressource inconnue : ${resource}` });
  }

  // Construction dynamique de la liste de colonnes à sélectionner
  const cols = cfg.fields.join(", ");
  const sql = `
    SELECT ${cols}
      FROM ${resource}
    WHERE ${cfg.pk} = $1
  `;

  console.log("→ GET  /api/:resource/:id", { resource, id });
  console.log("   SQL:", sql.trim());
  console.log("   values:", [id]);

  const result = await pool.query(sql, [id]);
  if (result.rowCount === 0) {
    return res.status(404).json({ error: `${resource} non trouvé(e)` });
  }

  res.json(result.rows[0]);
}));

// DELETE générique (sauf "salle")
app.delete("/api/:resource/:id", asyncHandler(async (req, res, next) => {
  const { resource, id } = req.params;

  const cfg = resources[resource];
  if (!cfg) {
    return res.status(400).json({ error: `Ressource inconnue : ${resource}` });
  }

  const sql = `
    DELETE FROM ${resource}
    WHERE ${cfg.pk} = $1
    RETURNING *;
  `;

  console.log("→ DELETE /api/:resource/:id", { resource, id });
  console.log("   SQL:", sql.trim());
  console.log("   values:", [id]);

  const result = await pool.query(sql, [id]);
  if (result.rowCount === 0) {
    return res.status(404).json({ error: `${resource} non trouvé(e)` });
  }

  res.json({ deleted: result.rows[0] });
}));


app.patch("/api/:resource/:id", asyncHandler(async (req, res, next) => {
  try {
    const { resource, id } = req.params;
    const cfg = resources[resource];

    console.log("→ PATCH /api/:resource/:id", { resource, id });
    console.log("   body:", req.body);
    console.log("   cfg.fields:", cfg && cfg.fields);

    // ne conserve que les clés autorisées
    const updates = Object.keys(req.body).filter(key => cfg.fields.includes(key));
    console.log("   updates retenues:", updates);

    if (!cfg) {
      return res.status(400).json({ error: `Ressource inconnue : ${resource}` });
    }
    if (updates.length === 0) {
      return res.status(400).json({ error: 'Aucun champ à mettre à jour' });
    }

   // au lieu de `"${col}"` et `"${resource}"`
    const setClause = updates
    .map((col, i) => `${col} = $${i+1}`)     // col reste 'nomProjecteur' ou 'idEtat'
    .join(", ");
    const values = updates.map(col => req.body[col]);
    values.push(id);

    const sql = `
      UPDATE ${resource}
        SET ${setClause}
      WHERE ${cfg.pk} = $${values.length}
      RETURNING *;
    `;

    console.log("   SQL:", sql.trim());
    console.log("   values:", values);

    const result = await pool.query(sql, values);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: `${resource} non trouvé(e)` });
    }
    res.json(result.rows[0]);
  } catch(err) {
    console.error("‼️ Erreur dans la route PATCH :", err);
    next(err);
  }
}));

// == Alertes ==
// GET  /api/alertes          → liste toutes les alertes
// POST /api/alerte           → créer une alerte
// DELETE /api/alerte/:id     → supprimer une alerte

app.get("/api/alertes", asyncHandler(async (req, res) => {
  const { rows } = await pool.query(`
    SELECT idAlerte, message, idSalle, created_at
    FROM alerte
    ORDER BY created_at DESC
  `);
  res.json(rows);
}));

app.post("/api/alerte", asyncHandler(async (req, res) => {
  console.log("🔔 Reçu POST /api/alerte :", req.body);
  try {
    console.log("🔔 Reçu POST /api/alerte :", req.body);
    const { message } = req.body;
    const result = await pool.query(
      `INSERT INTO alerte (message)
       VALUES ($1)
       RETURNING idAlerte, message, created_at`,
      [message]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("🔥 Erreur POST /api/alerte →", err);  // <— ajoute bien err ici
    return res.status(500).json({ error: err.message });
  }
}));


app.delete("/api/alerte/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    `DELETE FROM alerte
     WHERE idAlerte = $1
     RETURNING *`,
    [id]
  );
  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Alerte non trouvée' });
  }
  res.json({ message: 'Alerte supprimée', alerte: result.rows[0] });
}));

// == Réservations ==
// GET  /api/reservations             → liste toutes les réservations
// POST /api/reservation              → créer une réservation
// DELETE /api/reservation/:id        → supprimer une réservation

app.get("/api/reservations", asyncHandler(async (req, res) => {
  const { rows } = await pool.query(`
    SELECT idReservation, idSalle, start_datetime, end_datetime, idValidationReservation, created_at
    FROM reservation
    ORDER BY start_datetime
  `);
  res.json(rows);
}));

app.post("/api/reservation", asyncHandler(async (req, res) => {
  const { idSalle, start_datetime, end_datetime, idValidationReservation } = req.body;
  const result = await pool.query(
    `INSERT INTO reservation (idSalle, start_datetime, end_datetime, idValidationReservation)
     VALUES ($1, $2, $3, $4)
     RETURNING idReservation, idSalle, start_datetime, end_datetime, idValidationReservation, created_at`,
    [idSalle, start_datetime, end_datetime, idValidationReservation]
  );
  res.status(201).json(result.rows[0]);
}));

app.delete("/api/reservation/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    `DELETE FROM reservation
     WHERE idReservation = $1
     RETURNING *`,
    [id]
  );
  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Réservation non trouvée' });
  }
  res.json({ message: 'Réservation supprimée', reservation: result.rows[0] });
}));


app.post("/api/:resource", asyncHandler(async (req, res, next) => {
  const { resource } = req.params;

  const cfg = resources[resource];
  if (!cfg) {
    return res.status(400).json({ error: `Ressource inconnue : ${resource}` });
  }

  // On ne conserve que les champs autorisés pour l'insertion
  const cols = Object.keys(req.body).filter(key => cfg.fields.includes(key));
  if (cols.length === 0) {
    return res.status(400).json({ error: 'Aucun champ à insérer' });
  }

  const colNames    = cols.join(", ");
  const placeholders = cols.map((_, i) => `$${i+1}`).join(", ");
  const values       = cols.map(col => req.body[col]);

  const sql = `
    INSERT INTO ${resource} (${colNames})
    VALUES (${placeholders})
    RETURNING *;
  `;

  console.log("→ POST  /api/:resource", { resource });
  console.log("   SQL:", sql.trim());
  console.log("   values:", values);

  const result = await pool.query(sql, values);
  res.status(201).json(result.rows[0]);
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