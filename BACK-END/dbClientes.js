const config = require("./dbconfig")
const sql = require("mssql");

async function inserirCliente(nomeUsuario, senha) {
    let pool;
    try {
    pool = await sql.connect(config);
    await pool.request()
            .input('nomeUsuario', sql.VarChar(100), nomeUsuario)
            .input('senha', sql.VarChar(30), senha)
            .execute('SabDiv.inserirCliente');
    } catch (error) {
        console.error("Erro ao inserir cliente: " + error.message);
        throw error;
    } finally {
        if (pool) {
        await pool.close();
      }
    }
}

async function validarLogin(usuario, senha) {
    let pool;
    try {
        pool = await sql.connect(config);
        const result = await sql.query`SELECT * FROM SabDiv.Clientes WHERE NomeUsuario = ${usuario} AND Senha = ${senha}`;
        if (result.recordset.length > 0) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
      } finally {
        if (pool) {
        await pool.close();
      }
    }
}

async function inserirEnderecoCliente(nomeUsuario, Endereco, CEP) {
  let pool;
  try {
      pool = await sql.connect(config);
      await pool.request()
          .input('nomeUsuario', sql.VarChar(100), nomeUsuario)
          .input('Endereco', sql.VarChar(200), Endereco)
          .input('CEP', sql.Char(8), CEP)
          .execute('SabDiv.inserirEnderecoCliente');
  } catch (error) {
      console.error("Erro ao inserir endereço: " + error.message);
      throw error;
  } finally {
      if (pool) {
      await pool.close();
    }
  }
}

async function obterHistoricoPedidos(nomeUsuario) {
  let pool;
    try {
        pool = await sql.connect(config);
        const result = await pool.query`EXEC SabDiv.HistoricoPedidosCliente @nomeUsuario = ${nomeUsuario}`;
        return result.recordset;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
    if (pool) {
      await sql.close();
    }
  }
}

async function inserirPedido(nomeUsuario, metodoPagamento) {
  let pool;
    try {
      pool = await sql.connect(config);
      await pool.request()
        .input('nomeUsuario', sql.VarChar(100), nomeUsuario)
        .input('metodoPagamento', sql.VarChar(30), metodoPagamento)
        .execute('SabDiv.inserirPedido');
    } catch (error) {
      console.error("Erro ao inserir pedido: " + error.message);
      throw error;
    } finally {
      if (pool) {
      await pool.close();
    }
  }
}

async function inserirItemPedido(nomeUsuario, nomeItem, quantidade) {
    let pool;
    try {
      pool = await sql.connect(config);
      await pool.request()
        .input('nomeUsuario', sql.VarChar(100), nomeUsuario)
        .input('nomeItem', sql.VarChar(40), nomeItem)
        .input('quantidade', sql.Int, quantidade)
        .execute('SabDiv.inserirItensDePedidos');
    } catch (error) {
      console.error("Erro ao inserir item de pedido: " + error.message);
      throw error;
    } finally {
      if (pool) {
      await pool.close();
    }
  }
}
  
  async function calcularEinserirPrecoTotal(nomeUsuario) {
    let pool;
    try {
      pool = await sql.connect(config);
      await pool.request()
        .input('nomeUsuario', sql.VarChar(100), nomeUsuario)
        .execute('SabDiv.calcularEinserirPrecoTotal');
    } catch (error) {
      console.error("Erro ao inserir preço total: " + error.message);
      throw error;
    } finally {
      if (pool) {
      await pool.close();
    }
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
