var config = require("./dbconfig")
const sql = require("mssql");

async function inserirCliente(nomeUsuario, senha) {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('nomeUsuario', sql.VarChar(100), nomeUsuario)
            .input('senha', sql.VarChar(30), senha)
            .execute('SabDiv.inserirCliente');
        return result.recordset;
    } catch (error) {
        console.error("Erro ao inserir cliente: " + error.message);
        throw error;
    }
}

async function validarLogin(usuario, senha) {
    try {
        await sql.connect(config);
        const result = await sql.query`SELECT * FROM SabDiv.Clientes WHERE NomeUsuario = ${usuario} AND Senha = ${senha}`;
        if (result.recordset.length > 0) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.error(err);
        return false;
    } finally {
      await sql.close();
    }
}

async function inserirEnderecoCliente(nomeUsuario, Endereco, CEP) {
  try {
      let pool = await sql.connect(config);
      let result = await pool.request()
          .input('nomeUsuario', sql.VarChar(100), nomeUsuario)
          .input('Endereco', sql.VarChar(200), Endereco)
          .input('CEP', sql.Char(8), CEP)
          .execute('SabDiv.inserirEnderecoCliente');
      return result.recordset;
  } catch (error) {
      console.error("Erro ao inserir endereço: " + error.message);
      throw error;
  }
}

async function obterHistoricoPedidos(nomeUsuario) {
    try {
        await sql.connect(config);
        const resultado = await sql.query`EXEC SabDiv.HistoricoPedidosCliente @nomeUsuario = ${nomeUsuario}`;
        return resultado.recordset;
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        await sql.close();
    }
}

async function inserirPedido(nomeUsuario, metodoPagamento) {
    try {
      let pool = await sql.connect(config);
  
      // Inserir pedido usando stored procedure
      let result = await pool.request()
        .input('nomeUsuario', sql.VarChar(100), nomeUsuario)
        .input('metodoPagamento', sql.VarChar(30), metodoPagamento)
        .execute('SabDiv.inserirPedido');
  
      return result.recordset;
    } catch (error) {
      console.error("Erro ao inserir pedido: " + error.message);
      throw error;
    } finally {
      await sql.close();
    }
}

async function inserirItemPedido(nomeUsuario, nomeItem, quantidade) {
    try {
      let pool = await sql.connect(config);
  
      let result = await pool.request()
        .input('nomeUsuario', sql.VarChar(100), nomeUsuario)
        .input('nomeItem', sql.VarChar(40), nomeItem)
        .input('quantidade', sql.Int, quantidade)
        .execute('SabDiv.inserirItensDePedidos');
  
      console.log('Stored procedure executada com sucesso: InserirItensDePedidos');
  
    } catch (error) {
      console.error('Erro ao chamar a stored procedure: ' + error.message);
      throw error;
    } finally {
      await sql.close();
    }
  }
  
  async function calcularEinserirPrecoTotal(nomeUsuario) {
    try {
      if (!nomeUsuario) {
        throw new Error('Nome de usuário é obrigatório');
      }
  
      let pool = await sql.connect(config);

      let result = await pool.request()
        .input('nomeUsuario', sql.VarChar(100), nomeUsuario)
        .execute('SabDiv.calcularEinserirPrecoTotal');
  
      return result.recordset;
    } catch (error) {
      console.error('Erro ao chamar a stored procedure: ' + error.message);
      throw error;
    } finally {
      await sql.close();
    }
  }
  


module.exports = {
    inserirCliente: inserirCliente,
    validarLogin: validarLogin,
    inserirEnderecoCliente: inserirEnderecoCliente,
    obterHistoricoPedidos: obterHistoricoPedidos,
    inserirPedido: inserirPedido,
    inserirItemPedido: inserirItemPedido,
    calcularEinserirPrecoTotal: calcularEinserirPrecoTotal
}

