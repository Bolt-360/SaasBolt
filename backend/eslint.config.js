export default [
    {
      ignores: ["node_modules/**"], // Ignora a pasta node_modules
    },
    {
      files: ["**/*.js"], // Aplica as regras a todos os arquivos .js
      languageOptions: {
        ecmaVersion: "latest", // Define a versão do ECMAScript mais recente
        sourceType: "module",  // Se você estiver usando ES Modules
      },
      rules: {
        "no-console": "off",
        "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
        "consistent-return": "error",
        "eqeqeq": "error",
        "curly": "error",
        "no-process-exit": "off"
      },
    },
  ];
  