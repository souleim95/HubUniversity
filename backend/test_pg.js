require('dotenv').config();
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.query("SELECT NOW()", (err, res) => {
    if (err) {
        console.error("❌ Erreur de connexion PostgreSQL :", err);
    } else {
        console.log("✅ Connexion PostgreSQL réussie :", res.rows);
    }
    pool.end();
});
