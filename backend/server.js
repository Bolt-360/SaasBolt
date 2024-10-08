import express from 'express';
import dotenv from 'dotenv';
import pkg from 'pg'; // Importação do Pool diretamente
import cookieParser from 'cookie-parser'; // Corrigido para cookie-parser
import { server } from './socket/socket.js'; // Removido `io` já que não é usado
const { Pool } = pkg; // Desestruturação do Pool a partir do pkg

// Importação das rotas
import authRouters from "./routes/auth.routes.js";
import messageRouters from "./routes/message.routes.js";
import userRouters from "./routes/user.routes.js";
import workspacesRouters from "./routes/workspaces.routes.js";
import conversationsRouters from "./routes/conversations.routes.js";

// Inicialização do dotenv
dotenv.config();

// Configuração do servidor
const PORT = process.env.PORT || 3000;

// Conexão do PostgreSQL
const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT || 5432,
});

// Teste de conexão ao PostgreSQL
pool.connect()
    .then(client => {
        console.log('Conectado ao PostgreSQL com sucesso!');
        client.release();
    })
    .catch(err => {
        console.error('Erro ao conectar ao PostgreSQL:', err);
    });

// Inicialização do aplicativo Express
const app = express();

// Middleware para JSON e cookies
app.use(express.json());
app.use(cookieParser());

// Rota de teste
app.get("/", async (req, res) => {
    let client;

    try {
        client = await pool.connect();
        const result = await client.query("SELECT NOW()");
        res.status(200).send('Servidor está rodando e o PostgreSQL retornou: ' + result.rows[0].now);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao conectar ao PostgreSQL: ' + err);
    } finally {
        if (client) {
            client.release();
        }
    }
});

// Configuração das rotas
app.use("/api/auth", authRouters);
app.use("/api/messages", messageRouters);
app.use("/api/users", userRouters);
app.use("/api/workspaces", workspacesRouters);
app.use("/api/conversations", conversationsRouters);

// Inicialização do servidor
server.listen(PORT, () => {
    console.log("Server is running on port: " + PORT);
});

// Middleware de tratamento de erros
app.use((err, req, res) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        message,
    });
});
