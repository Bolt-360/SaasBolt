import User from '../models/user.js'; // ajuste o caminho conforme necessário

export const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        res.status(500).send('Erro ao buscar usuários: ' + err);
    }
};
