import models from '../models/index.js';
import { errorHandler } from '../utils/error.js';

const { Workspace, UserWorkspace } = models; // Removido User

export const getUserWorkspaces = async (req, res, next) => {
    try {
        const userId = req.user.id;
        
        if (!userId) {
            return next(errorHandler(400, "ID do usuário não fornecido"));
        }

        const userWorkspaces = await UserWorkspace.findAll({
            where: { userId },
            include: [{
                model: Workspace,
                as: 'workspace',
            }],
        });

        if (!userWorkspaces || userWorkspaces.length === 0) {
            return next(errorHandler(404, "O usuário não tem Workspace cadastrado"));
        }

        return res.status(200).json(userWorkspaces); // Adicionando return para consistência
    } catch (error) {
        console.error('Erro ao buscar workspaces do usuário:', error);
        return next(error); // Adicionando return para consistência
    }
};

export const getUserActiveWorkspaces = async (req, res, next) => {
    try {
        const userId = req.user.id;
        
        if (!userId) {
            return next(errorHandler(400, "ID do usuário não fornecido"));
        }

        const userActiveWorkspaces = await UserWorkspace.findAll({
            where: { userId, isActive: true },
            include: [{
                model: Workspace,
                as: 'workspace',
            }],
        });

        if (!userActiveWorkspaces || userActiveWorkspaces.length === 0) {
            return next(errorHandler(404, "O usuário não tem Workspace ativo"));
        }

        return res.status(200).json(userActiveWorkspaces); // Adicionando return para consistência
    } catch (error) {
        console.error('Erro ao buscar workspaces ativos do usuário:', error);
        return next(error); // Adicionando return para consistência
    }
};
