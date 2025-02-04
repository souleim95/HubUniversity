require('dotenv').config();
console.log("🔍 DATABASE_URL:", process.env.DATABASE_URL);
const express = require('express');
const cors = require('cors');
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Backend is running 🚀"));

// WebSockets (ex: notifications incidents)
io.on("connection", (socket) => {
    console.log("Nouvel utilisateur connecté 🔗");
    socket.on("disconnect", () => console.log("Utilisateur déconnecté ❌"));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Serveur backend sur http://localhost:${PORT}`));


const { Pool } = require("pg");
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "projet_universite",
    password: "",  
    port: 5432
});


app.get("/users", async (req, res) => {
    const { rows } = await pool.query("SELECT * FROM users");
    res.json(rows);
});
