import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const isAuthenticate = async (req, res, next) => {
    const token = req.cookies.access_token;

    // Verifica se o token está presente
    if (!token) {
        return next(errorHandler(401, "Não autorizado"));
    }

    try {
        // Verifica o token JWT
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user; // Atribui o usuário ao objeto de solicitação

        return next(); // Chama o próximo middleware
    } catch (err) {
        // Retorna erro se o token for inválido, agora usando o err na mensagem
        return next(errorHandler(403, "Forbidden: " + err.message));
    }
};
