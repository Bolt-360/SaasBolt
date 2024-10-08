import models from '../models/index.js';
import { Op } from 'sequelize';
import { errorHandler } from '../utils/error.js';

const { User } = models;

export const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        return res.status(200).json(users); // Adicionando status 200 para a resposta
    } catch (error) {
        console.error('Erro ao buscar usuários:', error); // Log do erro para depuração
        return res.status(500).json({ message: 'Erro ao buscar usuários', error: error.message }); // Mensagem de erro mais clara
    }
};

export const getUserForSidebar = async (req, res, next) => {
    try {
        const loggedInUserId = req.user.id; // ID do usuário logado

        // Busca todos os usuários exceto o logado
        const allUserExceptLoggedInUser = await User.findAll({
            where: {
                id: {
                    [Op.not]: loggedInUserId, // Excluir o usuário logado
                },
            },
            attributes: { exclude: ['password'] }, // Excluir a senha do resultado
        });

        if (allUserExceptLoggedInUser.length === 0) {
            return next(errorHandler(404, 'Não há usuários para exibir'));
        }

        return res.status(200).json(allUserExceptLoggedInUser); // Enviar o resultado como JSON
    } catch (error) {
        console.error('Erro ao buscar usuários para a sidebar:', error); // Log do erro para depuração
        return next(error); // Encaminhar erro para o middleware de erro
    }
};
