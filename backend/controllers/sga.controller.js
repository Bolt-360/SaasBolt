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
                        'Content-Type': 'application/json'
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
                    vencimentos: sgaCredentials.vencimentos || [], 
                    firstDay: sgaCredentials.firstDay || false 
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


export const searchBoleto = async (req, res, next) => {
    try {
        const workspaceId = req.user.activeWorkspaceId;
        const { nosso_numero } = req.params; // Pegar o número do boleto 

        if (!workspaceId) {
            return next(errorHandler(400, "Nenhum workspace ativo encontrado"));
        }

        if (!nosso_numero) {
            return next(errorHandler(400, "Número do boleto é obrigatório"));
        }

        // Buscar credenciais do SGA para este workspace
        const sgaCredentials = await SgaCredentials.findOne({
            where: { workspaceId }
        });

        if (!sgaCredentials) {
            return next(errorHandler(404, "Credenciais do SGA não encontradas. Por favor, sincronize primeiro."));
        }

        try {
            // Fazer a requisição de busca do boleto ao SGA
            const response = await axios.get(`https://api.hinova.com.br/api/sga/v2/buscar/boleto/${nosso_numero}`, 
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': sgaCredentials.auth_Token
                    }
                }
            );

            res.status(200).json(response.data);

        } catch (apiError) {
            console.error('Erro na busca do boleto:', apiError.response?.data || apiError.message);
            return next(errorHandler(apiError.response?.status || 500, "Falha ao buscar boleto. Verifique o número informado."));
        }

    } catch (error) {
        console.error('Erro ao processar busca de boleto:', error);
        next(error);
    }
};