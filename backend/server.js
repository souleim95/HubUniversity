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

// Express et WebSocket
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
// Vérification de la connexion PostgreSQL
pool.connect()
  .then(() => console.log("✅ Connexion PostgreSQL réussie"))
  .catch(err => console.error("❌ Erreur de connexion à PostgreSQL :", err));

// -------------------------
// Routes API (backend)
// -------------------------

// Route de test de l'API
app.get("/api", (req, res) => res.send("Backend API is running 🚀"));

// Route pour récupérer les utilisateurs
app.get("/api/users", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users");
    res.json(rows);
  } catch (err) {
    console.error("Erreur de récupération des utilisateurs :", err);
    res.status(500).send("Erreur serveur");
  }
});
// Route pour ajouter un nouvel utilisateur
app.post("/api/users", async (req, res) => {
  const { name, email, role, password } = req.body;

  // Vérifier que tous les champs nécessaires sont présents
  if (!name || !email || !role || !password) {
    return res.status(400).json({ error: "Les champs name, email, role et password sont obligatoires." });
  }

  try {
    // Hacher le mot de passe
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const result = await pool.query(
      "INSERT INTO users (name, email, role, password) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, role, passwordHash]
    );
    console.log("Nouvel utilisateur ajouté :", result);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erreur lors de l'ajout d'un utilisateur :", err);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
});
//Connexion : Route pour se connecter
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Les champs email et password sont obligatoires." });
  }

  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = rows[0];
    console.log("Utilisateur trouvé :", rows);

    if (!user) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect." });
    }

    const match = await bcrypt.compare(password, user.password);

    if (match) {
      res.json({ message: "Connexion réussie", user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } else {
      res.status(401).json({ error: "Email ou mot de passe incorrect." });
    }
  } catch (err) {
    console.error("Erreur lors de la connexion :", err);
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
