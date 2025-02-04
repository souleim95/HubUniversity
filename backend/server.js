require('dotenv').config({ path: './Database-URL.env' });
console.log("🔍 DATABASE_URL (avant connexion):", process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
    console.error("❌ ERREUR: DATABASE_URL est undefined. Vérifiez votre fichier .env !");
    process.exit(1); // Arrête le serveur immédiatement
}


const express = require('express');
const cors = require('cors');
const { Server } = require("socket.io");
const http = require("http");
const { Pool } = require("pg");

// Express et WebSocket
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// Connexion à PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false, // Pour les connexions cloud
});

// Vérification de la connexion PostgreSQL
pool.connect()
    .then(() => console.log("✅ Connexion PostgreSQL réussie"))
    .catch(err => console.error("❌ Erreur de connexion à PostgreSQL :", err));

// Route Test
app.get("/", (req, res) => res.send("Backend is running 🚀"));

// WebSockets (ex: notifications incidents)
io.on("connection", (socket) => {
    console.log("Nouvel utilisateur connecté 🔗");
    socket.on("disconnect", () => console.log("Utilisateur déconnecté ❌"));
});

// Route pour récupérer les utilisateurs
app.get("/users", async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM users");
        res.json(rows);
    } catch (err) {
        console.error("Erreur de récupération des utilisateurs :", err);
        res.status(500).send("Erreur serveur");
    }
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Serveur backend sur http://localhost:${PORT}`));
