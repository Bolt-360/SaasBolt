import axios from 'axios';
import models from '../models/index.js';
import { errorHandler } from '../utils/error.js';

const { SgaCredentials, Workspace } = models;

export const syncSgaCredentials = async (req, res, next) => {
    try {
        const workspaceId = req.user.activeWorkspaceId;
        const { usuario, senha, tokenAtual } = req.body;

        if (!workspaceId) {
            return next(errorHandler(400, "Nenhum workspace ativo encontrado"));
        }

        if (!usuario || !senha || !tokenAtual) {
            return next(errorHandler(400, "Usuário, senha e token atual são obrigatórios"));
        }

        // Configuração do token de autorização da API
        const API_TOKEN = "34123dfa70a1885814527613295cbae3f39e27ea223092c190bd171febf85e4a075b1a7bbd8d9b88565b0d00fe5f36db6eda345518b12b7c82e79fd61c31b0692df2a4ff8b3fc0c569f070f424b2d20426f801e1df5fc37b1b406246dc920774a88ab59e51922c89eee69bbe138411589f813a869d11d826a919fc9abe6e3dec0a5e78dfd72f2097352ab45778a143f1";

        try {
            // Fazer a requisição de autenticação ao SGA
            const response = await axios.post('https://api.hinova.com.br/api/sga/v2/usuario/autenticar', 
                { 
                    usuario, 
                    senha,
                    token_atual: tokenAtual // Incluindo o token atual na requisição
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${API_TOKEN}`
                    }
                }
            );

            const tokenUsuario = response.data.token_usuario;

            // Buscar ou criar credenciais do SGA para este workspace
            let sgaCredentials = await SgaCredentials.findOne({
                where: { workspaceId }
            });

            if (sgaCredentials) {
                // Atualizar credenciais existentes
                await sgaCredentials.update({
                    login: usuario,
                    password: senha,
                    token: tokenUsuario,
                    auth_Token: `Bearer ${tokenUsuario}`,
                    vencimentos: sgaCredentials.vencimentos || [], // Mantém os vencimentos existentes
                    firstDay: sgaCredentials.firstDay || false // Mantém a configuração existente
                });
            } else {
                // Criar novas credenciais
                sgaCredentials = await SgaCredentials.create({
                    workspaceId,
                    login: usuario,
                    password: senha,
                    token: tokenUsuario,
                    auth_Token: `Bearer ${tokenUsuario}`,
                    vencimentos: [],
                    firstDay: false
                });
            }

            res.status(200).json({
                message: "Credenciais do SGA sincronizadas com sucesso",
                credentials: {
                    login: usuario,
                    token: tokenUsuario
                }
            });

        } catch (apiError) {
            console.error('Erro na autenticação com o SGA:', apiError.response?.data || apiError.message);
            return next(errorHandler(401, "Falha na autenticação com o SGA. Verifique suas credenciais."));
        }

    } catch (error) {
        console.error('Erro ao sincronizar credenciais do SGA:', error);
        next(error);
    }
};