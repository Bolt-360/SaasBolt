import express from 'express'
import dotenv from 'dotenv'
import pkg from 'pg'

dotenv.config()

const { Pool } = pkg

const PORT = process.env.PORT || 3000
// Conexão do Postgres
const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT || 5432,
})

// Teste de conexão ao PostgreSQL
pool.connect()
    .then(client => {
        console.log('Conectado ao PostgreSQL com sucesso!')
        client.release()
    })
    .catch(err => {
        console.error('Erro ao conectar ao PostgreSQL:', err)
    })

const app = express()
app.get("/", async (req, res) => {
    let client;

    try {
        client = await pool.connect()
        const result = await client.query("SELECT NOW()")
        res.status(200).send('Servidor está rodando e o PostgreSQL retornou: ' + result.rows[0].now)
    } catch (err) {
        console.error(err)
        res.status(500).send('Erro ao conectar ao PostgreSQL: ' + err)
    } finally {
        if (client) {
            client.release()
        }
    }
})

//importação de rotas
import authRouters from "./routes/auth.routes.js"

//JSON para enviar os dados para o frontend
app.use(express.json())
app.use("/api/auth", authRouters)

app.listen(PORT, () => {
    console.log("Server is running on port: " + PORT)
})
