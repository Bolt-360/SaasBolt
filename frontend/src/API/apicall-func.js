
import Cookies from 'js-cookie';

export const signincall = {
    login: async (email, password) => {
            const payload = {
                'email': email,
                'password': password,
            };
        
            try {
                const response = await fetch("http://localhost:2345/api/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });
        
                const data = await response.json();
        
                if (!response.ok) {
                
                    return { success: data.success, message: data.message };
                }

                Cookies.set('token', data.token, { expires: 7 }); //Armazena token no Cookie, dura 7 dias.
                return {data: data}; //retorna resposta json
            } catch (error) {
        
                return { success: false, error: error.message };
            }
        }
    };

    export const signupcall = {
        signup: async (email, password, confirmPassword, name, cpf, gender) => {
                const payload = {
                    'username': name,
                    'email': email,
                    'password': password,
                    'confirmPassword': confirmPassword,
                    'cpf': cpf,
                    'gender': gender
                  };
            
                try {
                    const response = await fetch("http://localhost:2345/api/auth/cadastro", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(payload),
                    });
            
                    const data = await response.json();
            
                    if (!response.ok) {
                    
                        return {data: data};
                    }

                    Cookies.set('token', data.token, { expires: 7 }); // Armazena token no Cookie
                    return {data}; // retorna resposta
                } catch (error) {
            
                    return { success: false, error: error.message };
                }
            }
        };

