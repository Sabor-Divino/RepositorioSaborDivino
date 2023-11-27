var express = require('express');
var router = express.Router();
const sqlCardapiosEitens = require("../dbCardapiosEitens")
const sqlClientes = require("../dbClientes")
// const { inserirCliente } = require('../dbClientes');
// const { validarLogin } = require('../dbClientes');


router.get('/inserir-cliente', async (req, res) => { // http://localhost:3000/inserir-cliente?nomeUsuario=A&senha=A
  const { nomeUsuario, senha } = req.query;
  try {
    if (!nomeUsuario || !senha) {
      return res.status(400).json({ mensagem: 'Nome de usuário e senha são obrigatórios' });
    }
    const resultado = await sqlClientes.inserirCliente(nomeUsuario, senha);
    res.status(201).json(resultado);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro no servidor ao inserir cliente' });
  }
});

router.get('/validar-login', async (req, res) => { // http://localhost:3000/validar-login?nomeUsuario=A&senha=A
  const { nomeUsuario, senha } = req.query;
  try {
    if (!nomeUsuario || !senha) {
      return res.status(400).json({ mensagem: 'Nome de usuário e senha são obrigatórios' });
    }
    const loginValido = await sqlClientes.validarLogin(nomeUsuario, senha);
    if (loginValido) {
      res.status(200).json({ mensagem: 'Login válido' });
    } else {
      res.status(401).json({ mensagem: 'Login inválido' });
    }
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ mensagem: 'Erro no servidor' });
    }
});

// inserirCliente('testezzz', 234256)
//   .then((result) => {
//     console.log("Cliente inserido com sucesso");
//   })
//   .catch((error) => {
//   console.error("Erro ao inserir cliente");
// });

// validarLogin('Usuario1', 'Senha1')
//   .then((resultado) => {
//     if (resultado) {
//       console.log("Cliente válido");
//     } else {
//       console.error("Cliente inválido");
//     }
//   })
//   .catch((erro) => {
//     console.error("Ocorreu um erro:");
//   });

router.get("/selectLanches", function(req, res, next){ // http://localhost:3000/selectLanches
  sqlCardapiosEitens.selectLanches().then((result) =>{
    res.json(result[0]);
  });
});

router.get("/selectBebidas", function(req, res, next){ // http://localhost:3000/selectBebidas
  sqlCardapiosEitens.selectBebidas().then((result) =>{
    res.json(result[0]);
  });
});

router.get("/selectSobremesas", function(req, res, next){ // http://localhost:3000/selectSobremesas
  sqlCardapiosEitens.selectSobremesas().then((result) =>{
    res.json(result[0]);
  });
});

router.get('/inserir-pedido', async (req, res) => { // http://localhost:3000/inserir-pedido?nomeUsuario=A&metodoPagamento=A
  const { nomeUsuario, metodoPagamento } = req.query;

  try {
    if (!nomeUsuario || !metodoPagamento) {
      return res.status(400).json({ mensagem: 'Nome de usuário e método de pagamento são obrigatórios' });
    }

    const resultado = await sqlClientes.inserirPedido(nomeUsuario, metodoPagamento);

    res.status(201).json({ mensagem: 'Pedido inserido com sucesso', resultado });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro no servidor ao inserir pedido' });
  }
});

router.get('/inserir-item-pedido', async (req, res) => { // http://localhost:3000/inserir-item-pedido?nomeUsuario=A&nomeItem=A&quantidade=A
  const { nomeUsuario, nomeItem, quantidade } = req.query;

  try {
    if (!nomeUsuario || !nomeItem || !quantidade) {
      return res.status(400).json({ mensagem: 'Nome de usuário, nome do item e quantidade são obrigatórios' });
    }

    await sqlClientes.inserirItemPedido(nomeUsuario, nomeItem, quantidade);

    res.status(201).json({ mensagem: 'Item inserido ao pedido com sucesso' });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro no servidor ao inserir item ao pedido' });
  }
});

router.get('/calcular-e-inserir-preco-total', async (req, res) => {
  const { nomeUsuario } = req.query;

  try {
    if (!nomeUsuario) {
      return res.status(400).json({ mensagem: 'Nome de usuário é obrigatório' });
    }
    await sqlClientes.calcularEinserirPrecoTotal(nomeUsuario);

    res.status(200).json({ mensagem: 'Preço total calculado e inserido com sucesso' });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro no servidor ao calcular e inserir preço total' });
  }
});


router.get('/historico-pedidos/:nomeUsuario', async (req, res) => { 
  const nomeUsuario = req.params.nomeUsuario;

  try {
    const historicoPedidos = await sqlClientes.obterHistoricoPedidos(nomeUsuario);
    res.status(200).json(historicoPedidos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: 'Erro no servidor' });
  }
});

module.exports = router;