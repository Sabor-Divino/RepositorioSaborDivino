const sql = require('mssql');

const config = {
  user: 'BD23331',
  password: 'BD23331',
  server: 'regulus.cotuca.unicamp.br',
  database: 'BD23331',
  options: {
    encrypt: true,  // Se estiver usando a criptografia
    trustServerCertificate: true,  // Desativa a verificação do certificado
  },
};