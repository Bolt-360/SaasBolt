import User from "../models/user.js"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { validateCPF } from "../utils/validarCPF.js"

// Corrigir __dirname para módulos ES
dotenv.config();

export const cadastro = async(req, res) => {
    const { username, email, password, confirmPassword, cpf, gender } = req.body
    //Limpar os CPF
    const cleanedCPF = cpf.replace(/\D/g, '');
    //Validações Iniciais
    if(!username || !email || !password || !confirmPassword || !cleanedCPF || !gender){
        return res.status(400).json({
            sucess: false,
            message: 'Por favor, preencha todos os campos',
        })
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
        return res.status(400).json({
            sucess: false,
            message: 'Este usuário ja existe'
        })
    }

    //Verifica se o CPF já está em uso
    let validUserCPF = await User.findOne({ where: { cpf: cleanedCPF } });
    if(validUserCPF){
        return res.status(400).json({
            sucess: false,
            message: 'Este CPF ja existe'
        })
    }
    //Verificar se as senhas conferem
    if(password !== confirmPassword){
        return res.status(400).json({
            error: 'Senhas não conferem',
        })
    }
    //Criptografar a senha
    const hashedPassword = bcryptjs.hashSync(password, 10)

    //Define a imagem de perfil com base no genero
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`

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
        res.status(500).json({
            error: 'Erro interno do servidor',
        })
    }
}

export const login = (req, res) => {

}

export const logout = (req, res) => {

}