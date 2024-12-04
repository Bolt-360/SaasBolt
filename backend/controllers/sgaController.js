import models from '../models/index.js';

const { SgaCredentials, Workspace } = models;

export const syncSgaCredentials = async (req, res, next) => {
    try {
        const { login, password } = req.body;
        const workspaceId = req.user.activeWorkspaceId;

        if (!workspaceId) {
            return next(errorHandler(400, "Nenhum workspace ativo encontrado"));
        }

        let sgaCredentials = await SgaCredentials.findOne({
            where: { workspaceId }
        });
        try {
            const response = await axios.post('https://api.hinova.com.br/api/sga/v2/usuario/autenticar', {
                usuario: login,
                senha: password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const authToken = response.data.token_usuario;

            // Criar ou atualizar as credenciais do SGA
            if (sgaCredentials) {
                await sgaCredentials.update({
                    login,
                    password,
                    token: authToken,
                    auth_Token: `Bearer ${authToken}`
                });
            } else {
                sgaCredentials = await SgaCredentials.create({
                    workspaceId,
                    login,
                    password,
                    token: authToken,
                    auth_Token: `Bearer ${authToken}`
                });
            }

            res.status(200).json({
                message: "Credenciais do SGA sincronizadas com sucesso",
                credentials: {
                    login,
                    token: authToken
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

// Função auxiliar para verificar e obter credenciais válidas do SGA
export const getSgaCredentials = async (workspaceId) => {
    try {
        const credentials = await SgaCredentials.findOne({
            where: { workspaceId }
        });

        if (!credentials) {
            throw new Error("Credenciais do SGA não encontradas");
        }

        return credentials;
    } catch (error) {
        throw new Error("Erro ao obter credenciais do SGA: " + error.message);
    }
};