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
const apiCall = async (url, payload) => {
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
      return { success: false, message: data.message};
    }

    // Se sucesso, retorna os dados
    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const signincall = {
  login: async (email, password) => {
    const payload = { email, password };

    const response = await apiCall("http://localhost:2345/api/auth/login", payload);

    if (response.success) {
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

    const response = await apiCall("http://localhost:2345/api/auth/cadastro", payload);

    if (response.success) {
      // Armazena token e outros dados no cookie se cadastro for bem-sucedido
      storeUserDataInCookies(response.data);
    }

    return response; // Retorna sucesso ou erro
  }
};