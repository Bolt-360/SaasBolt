import User from "../models/user.js"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { validateCPF } from "../utils/validarCPF.js"
import { errorHandler } from "../utils/error.js"

dotenv.config();

//Cadastro
export const cadastro = async(req, res, next) => {
    const { username, email, password, confirmPassword, cpf, gender } = req.body
    //Verificar se todos os campos foram preenchidos
    if (!username || !email || !password || !confirmPassword || !cpf || !gender) {
        return next(errorHandler(400, 'Por favor, preencha todos os campos'));
    }
    //Limpar os CPF
    const cleanedCPF = cpf.replace(/\D/g, '');
    //Validações Iniciais
    if(!username || !email || !password || !confirmPassword || !cleanedCPF || !gender){
        return next(errorHandler(400, 'Este CPF ja existe'))
    }
    if(!validateCPF(cleanedCPF)){
        return res.status(400).json({
            sucess: false,
            message: 'CPF inválido',
        })
    }
    //Verifica se o email já está em uso
    let validUser = await User.findOne({ where: { email } });
    if(validUser){
        return next(errorHandler(400, 'Este email ja existe'))
    }
    //Verifica se o CPF já está em uso
    let validUserCPF = await User.findOne({ where: { cpf: cleanedCPF } });
    if(validUserCPF){
        return next(errorHandler(400, 'Este CPF ja existe'))
    }
    //Verificar se as senhas conferem
    if(password !== confirmPassword){
        return next(errorHandler(400, 'As senhas não conferem'))
    }
    //Criptografar a senha
    const hashedPassword = bcryptjs.hashSync(password, 10)
    //Define a imagem de perfil com base no genero
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`
    //Criar o usuário
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
        cpf: cleanedCPF,
        gender,
        profilePicture: gender === 'Masculino' ? boyProfilePic : girlProfilePic
    })
    try{
        //Gerar Token JWT
        const token = jwt.sign({
            id: newUser._id,
        }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        })
        // Salvar o usuário no banco de dados
        await newUser.save()
        res.cookie('access_token', token, {httpOnly: true}).status(201).json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            token,
            profilePicture: newUser.profilePicture,
        })
    }catch(error){
        console.log("Erro ao cadastrar", error)
        return next(errorHandler(500, 'Internal Server Error'))
    }
}

//Login
export const login = async (req, res, next) => {
    const { email, password } = req.body

    // Verificar se email e senha foram fornecidos
    if (!email || !password) {
        return next(errorHandler(400, 'Preencha todos os campos'))
    }

    try {
        // Buscar o usuário pelo email (aguardando a resposta do banco)
        const user = await User.findOne({ where: { email } })

        // Verificar se o usuário existe
        if (!user) {
            return next(errorHandler(400, 'Email ou senha inválido'))
        }

        // Verificar se a senha fornecida corresponde à senha criptografada
        const match = bcryptjs.compareSync(password, user.password)

        if (!match) {
            return next(errorHandler(400, 'Email ou senha inválido'))
        }

        // Gerar token JWT
        const token = jwt.sign(
            { id: user.id },  // Corrigido para usar `user.id`
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        // Definir cookie e enviar resposta
        res.cookie('access_token', token, { httpOnly: true }).status(200).json({
            _id: user.id,  // Corrigido para usar `user.id`
            username: user.username,
            email: user.email,
            token,
            profilePicture: user.profilePicture,
        })

    } catch (error) {
        console.log("Erro ao logar", error)
        return next(errorHandler(500, 'Internal Server Error'))
    }
}


export const logout = (req, res) => {

}