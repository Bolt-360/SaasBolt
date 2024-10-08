import models from '../models/index.js';
import { errorHandler } from '../utils/error.js';
const { User, Workspace, UserWorkspace } = models;

export const getUserWorkspaces = async (req, res, next) => {
    try {
        const userId = req.user.id;
        console.log(req.user)
        if (!userId) {
            return next(errorHandler(400, "ID do usuário não fornecido"))
        }

        const userWorkspaces = await UserWorkspace.findAll({
            where: { userId: userId },
            include: [{
                model: Workspace,
                as: 'workspace'
            }]
        });

        if (!userWorkspaces || userWorkspaces.length === 0) {
            return next(errorHandler(404, "O usuário não tem Workspace cadastrado"))
        }

        res.status(200).json(userWorkspaces);
    } catch (error) {
        console.error('Erro ao buscar workspaces do usuário:', error);
        next(error);
    }
};


export const getUserActiveWorkspaces = async (req, res, next) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return next(errorHandler(400, "ID do usuário não fornecido"))
        }

        const userActiveWorkspaces = await UserWorkspace.findAll({
            where: { userId: userId, isActive: true },
            include: [{
                model: Workspace,
                as: 'workspace'
            }]
        });

        if (!userActiveWorkspaces || userActiveWorkspaces.length === 0) {
            return next(errorHandler(404, "O usuário não tem Workspace ativo"))
        }

        res.status(200).json(userActiveWorkspaces);
    } catch (error) {
        next(error);
    }
}
