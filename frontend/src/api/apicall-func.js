import Cookies from 'js-cookie';

// Função auxiliar para armazenar dados no cookie
const storeUserDataInCookies = (data) => {
  Cookies.set('token', data.token, { expires: 7 });
  Cookies.set('username', data.username, { expires: 7 });
  Cookies.set('email', data.email, { expires: 7 });
  Cookies.set('profilePicture', data.profilePicture, { expires: 7 });
  Cookies.set('id', data._id, { expires: 7 });
};

// Função auxiliar para chamadas de API
const apiPostCall = async (url, payload) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Erro na requisição' };
    }

    // Se sucesso, retorna os dados
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const apiGetCall = async (url) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Erro na requisição' };
    }

    // Se sucesso, retorna os dados
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const signincall = {
  login: async (email, password) => {
    const payload = { email, password };

    const response = await apiPostCall("http://localhost:2345/api/auth/login", payload);

    if (response.success && response.data.token) {
      // Armazena token e outros dados no cookie se login for bem-sucedido
      storeUserDataInCookies(response.data);
    }

    return response; // Retorna sucesso ou erro
  }
};

export const signupcall = {
  signup: async (email, password, confirmPassword, name, cpf, gender) => {
    const payload = {
      username: name,
      email,
      password,
      confirmPassword,
      cpf,
      gender,
    };

    const response = await apiPostCall("http://localhost:2345/api/auth/cadastro", payload);

    if (response.success) {
      // Armazena token e outros dados no cookie se cadastro for bem-sucedido
      storeUserDataInCookies(response.data);
    }

    return response; // Retorna sucesso ou erro
  }
};

export const logoutcall = {
  logout: async () => {

    const response = await apiGetCall("http://localhost:2345/api/auth/logout");

    if (response.success) {
      const token = Cookies.get('token'); // Obtém o token do cookie
      if (token) {
        // Remove os cookies de autenticação durante o logout
        Cookies.remove('token');
        Cookies.remove('username');
        Cookies.remove('email');
        Cookies.remove('profilePicture');
        Cookies.remove('id');
      }
      return true; // Retorna sucesso
    } else {
      return false;
    }
  }
};

export const resetPwdcall = {
  resetpwdcall: async (email) => {
    const payload = {
      email
    };

    const response = await apiPostCall("http://localhost:2345/api/auth/forgotpassword", payload); // Gera Token de Reset e envia para o email

    if (response.success) {
      return response;
    }

    return response; // Retorna a resposta completa em caso de falha
  }
};

export const verPwdresetcall = {
  verpwdresetcall: async (token, email) => {
    const payload = {
      token,
      email
    };

    const response = await apiPostCall("http://localhost:2345/api/auth/verpwdtoken", payload); // Verifica se o Token informado é válido

    if (response.success) {
      return response;
    }

    return response; // Retorna a resposta completa em caso de falha
  }
};

export const chgPwdcall = {
  chgpwdcall: async (email, newPassword) => {
    const payload = {
      email,
      newPassword
    };

    const response = await apiPostCall("http://localhost:2345/api/auth/changepwd", payload); // Muda a senha do usuário para a nova informada

    if (response.success) {
      return response;
    }

    return response; // Retorna a resposta completa em caso de falha
  }
};

export const verTokenExists = {
  vertknresetcall: async (email, newPassword) => {
    const payload = {
      email,
      newPassword
    };

    const response = await apiPostCall("http://localhost:2345/api/auth/tokenresetverify", payload); // Verifica se já existe um token para o usuário.

    return response; // Retorna a resposta completa em caso de falha
  }
};