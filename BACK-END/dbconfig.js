const sql = require('mssql');

const config = {
  user: 'BD23331',
  password: 'BD23331',
  server: 'regulus.cotuca.unicamp.br',
  database: 'BD23331',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

sql.connect(config).then(pool => {
    console.log("conectado")
});


module.exports = config;
