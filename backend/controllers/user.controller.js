import models from '../models/index.js';
import { Op } from 'sequelize';
import { errorHandler } from '../utils/error.js';
const { User } = models;

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        res.status(500).send('Erro ao buscar usuários: ' + err);
    }
};

export const getUserForSidebar = async (req, res, next) => {
    try {
        const loggedInUserId = req.user.id; // ID do usuário logado

        // Busca todos os usuários exceto o logado
        const allUserExceptLoggedInUser = await User.findAll({
            where: {
                id: {
                    [Op.not]: loggedInUserId // Excluir o usuário logado
                }
            },
            attributes: { exclude: ['password'] } // Excluir a senha do resultado
        });
        
        if (allUserExceptLoggedInUser.length === 0 || !allUserExceptLoggedInUser) {
            return next(errorHandler(404, "Não há usuários para exibir"))
        }
        res.status(200).json(allUserExceptLoggedInUser); // Enviar o resultado como JSON
    } catch (error) {
        return next(error);
    }
};

