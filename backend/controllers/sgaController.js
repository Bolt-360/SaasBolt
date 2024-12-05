import axios from 'axios';
import models from '../models/index.js';
import { errorHandler } from '../utils/error.js';

const { SgaCredentials, Workspace } = models;

  export const createSgaUser = async (req, res, next) => {
      try {
          const { login, password } = req.body;
          const workspaceId = req.user.activeWorkspaceId;

          if (!workspaceId) {
              return next(errorHandler(400, "Nenhum workspace ativo encontrado"));
          }

          // Verificar se já existem credenciais para este workspace
          let sgaCredentials = await SgaCredentials.findOne({
              where: { workspaceId }
          });

          if (sgaCredentials) {
              return next(errorHandler(400, "Já existem credenciais do SGA para este workspace"));
          }

          // Fazer a requisição para criar o usuário no SGA
          try {
              const response = await axios.post('https://api.hinova.com.br/api/sga/v2/usuario/criar', {
                  usuario: login,
                  senha: password
              }, {
                  headers: {
                      'Content-Type': 'application/json'
                  }
              });

              const { token } = response.data;

              // Criar as credenciais do SGA
              sgaCredentials = await SgaCredentials.create({
                  workspaceId,
                  login,
                  password,
                  token,
                  auth_Token: `Bearer ${token}`
              });

              res.status(201).json({
                  message: "Usuário do SGA criado com sucesso",
                  credentials: {
                      login,
                      token
                  }
              });

          } catch (apiError) {
              console.error('Erro na criação do usuário no SGA:', apiError.response?.data || apiError.message);
              return next(errorHandler(401, "Falha na criação do usuário no SGA. Verifique as informações fornecidas."));
          }

      } catch (error) {
          console.error('Erro ao criar usuário do SGA:', error);
          next(error);
      }
  };

  export const syncSgaCredentials = async (req, res, next) => {
      try {
          const workspaceId = req.user.activeWorkspaceId;

          if (!workspaceId) {
              return next(errorHandler(400, "Nenhum workspace ativo encontrado"));
          }

          // Buscar as credenciais do SGA para este workspace
          const sgaCredentials = await SgaCredentials.findOne({
              where: { workspaceId }
          });

          if (!sgaCredentials) {
              return next(errorHandler(404, "Credenciais do SGA não encontradas para este workspace"));
          }

          // Usar o token armazenado para autenticar com o SGA
          try {
              const response = await axios.post('https://api.hinova.com.br/api/sga/v2/usuario/autenticar', {}, {
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': sgaCredentials.auth_Token
                  }
              });

              const newToken = response.data.token_usuario;

              // Atualizar o token no banco de dados
              await sgaCredentials.update({
                  token: newToken,
                  auth_Token: `Bearer ${newToken}`
              });

              res.status(200).json({
                  message: "Credenciais do SGA sincronizadas com sucesso",
                  credentials: {
                      login: sgaCredentials.login,
                      token: newToken
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

