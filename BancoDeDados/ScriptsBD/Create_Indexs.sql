create index ind_ItensDePedidos_IdPedido_IdItemDeCardapio
on SabDiv.ItensDePedidos (IdPedido, IdItemDeCardapio)

create index ind_Pedidos_IdCliente_IdMetodo
on SabDiv.Pedidos (IdCliente, IdMetodoPagamento)

create index ind_Clientes_Usuario_Senha
on SabDiv.Clientes (NomeUsuario, Senha)

create index ind_Enderecos_IdCliente
on SabDiv.EnderecosClientes (idCliente)

create index ind_ItensDeCardapios_IdCardapio
on SabDiv.ItensDeCardapios (IdCardapio)