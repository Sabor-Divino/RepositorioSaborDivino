//RA 23331 - Pedro Henrique Garcia do Nascimento
//RA 23338 -  Fabrício Carvalho Malagodi

var express = require('express');
var router = express.Router();
const sqlCardapiosEitens = require("../dbCardapiosEitens")
const sqlClientes = require("../dbClientes")


//curl -X POST -H "Content-Type: application/json" -d '{"nomeUsuario": "A", "senha": "A"}' http://localhost:3000/inserir-cliente
router.post('/inserir-cliente', async (req, res) => { 
  const { nomeUsuario, senha } = req.body;
  try {
    if (!nomeUsuario || !senha) {
      return res.status(400).json({ mensagem: 'Nome de usuário e senha são obrigatórios' });
    }
    const resultado = await sqlClientes.inserirCliente(nomeUsuario, senha);
    res.status(201).json({ mensagem: 'Cliente inserido com sucesso' });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao inserir cliente' });
  }
});

//curl -X POST -H "Content-Type: application/json" -d '{"nomeUsuario": "A", "senha": "A"}' http://localhost:3000/validar-login
router.post('/validar-login', async (req, res) => {
  const { nomeUsuario, senha } = req.body; 
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

//curl -X POST -H "Content-Type: application/json" -d '{"nomeUsuario": "A", "metodoPagamento": "A"}' http://localhost:3000/inserir-pedido
router.post('/inserir-pedido', async (req, res) => {
  const { nomeUsuario, metodoPagamento } = req.body;

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

//curl -X POST -H "Content-Type: application/json" -d '{"nomeUsuario": "", "metodoPagamento": "", nomeItem = "", quantidade = ""}' http://localhost:3000/inserir-item-pedido
router.post('/inserir-item-pedido', async (req, res) => {
  const { nomeUsuario, nomeItem, quantidade } = req.body;

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

//curl -X POST -H "Content-Type: application/json" -d '{"nomeUsuario": ""}' http://localhost:3000/calcular-e-inserir-preco-total
router.post('/calcular-e-inserir-preco-total', async (req, res) => {
  const { nomeUsuario } = req.body;

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

// http://localhost:3000/historico-pedidos/nomeUsuario
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

module.exports = router;
