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

app.use(cors());
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
      SELECT u.id, u.name, u.email, COALESCE(u.score, 0) as score, r.nomRole as role, u.created_at 
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

    if (match) {
      // On renvoie l'objet utilisateur sans le mot de passe.
      res.json({ 
        message: "Connexion réussie", 
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          role: user.role, 
          score: user.score
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
    
    // Retourner le nouveau score en réponse.
    res.json({
      message: "Score mis à jour avec succès.",
      score: rows[0].score
    });
    
  } catch (err) {
    console.error("Erreur lors de la mise à jour du score :", err);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
});




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
