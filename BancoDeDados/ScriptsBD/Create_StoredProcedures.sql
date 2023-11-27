create procedure SabDiv.inserirCliente
	@nomeUsuario varchar(100),
	@senha varchar(30)
as
begin
	insert into SabDiv.Clientes (NomeUsuario, Senha)
	values (@nomeUsuario, @senha)
	if @@error <> 0
	begin
			declare @Mensagem nvarchar(2000)
			Select @Mensagem = Error_Message()
			Raiserror('Erro na inclusão desse cliente: %s', @Mensagem, 16, 1)
	end
end;


create or alter procedure SabDiv.HistoricoPedidosCliente
    @nomeUsuario varchar(100)
as
begin
	declare @idCliente int
	select @idCliente = IdCliente from SabDiv.Clientes where NomeUsuario = @nomeUsuario
	if @idCliente <> 0
	begin
		select P.idPedido, M.Metodo MetodoPagamento, E.CEP, P.DataEhora, P.PrecoTotal
		from SabDiv.Pedidos P inner join
		SabDiv.MetodosDePagamento M on P.idMetodoPagamento = M.idMetodoPagamento inner join
		SabDiv.EnderecosClientes E on P.idCliente = E.IdCliente
		where
		P.idCliente = @idCliente;
	end
	else
	begin
		THROW 51000, 'Cliente não encontrado.', 1;
	end
end;


create procedure SabDiv.inserirPedido
	@nomeUsuario varchar(100),
	@metodoPagamento varchar(30)
as
begin
	declare @idCliente int
	declare @idMetodo int
	declare @dataEhora datetime = getdate()

	select @idCliente = idCliente from SabDiv.Clientes where NomeUsuario = @nomeUsuario
	select @idMetodo = idMetodoPagamento from SabDiv.MetodosDePagamento where Metodo = @metodoPagamento

	insert into SabDiv.Pedidos (IdCliente, IdMetodoPagamento, DataEhora)
	values (@idCliente, @idMetodo, @dataEhora)
	if @@error <> 0
	begin
			declare @Mensagem nvarchar(2000)
			Select @Mensagem = Error_Message()
			Raiserror('Erro na inclusão desse pedido: %s', @Mensagem, 16, 1)
	end
end;

create or alter procedure SabDiv.inserirItensDePedidos
	@nomeUsuario varchar(100),
	@nomeItem varchar(40),
	@quantidade int
as
begin
	declare @idCliente int
    select @idCliente = IdCliente from SabDiv.Clientes where NomeUsuario = @nomeUsuario
	if @idCliente <> 0
	begin
		declare @idItem int
		select @idItem = IdItemDeCardapio from SabDiv.ItensDeCardapios where NomeItem = @nomeItem
		if @idItem <> 0
		begin
			declare @ultimoIdPedido int
			select @ultimoIdPedido = max(IdPedido)
			FROM SabDiv.Pedidos
			WHERE IdCliente = @idCliente;

			insert into SabDiv.ItensDePedidos (IdPedido, IdItemDeCardapio, Quantidade)
			values(@ultimoIdPedido, @idItem, @quantidade)
			print'Item inserido ao pedido'
		end
		else
		begin
			THROW 51000, 'O item de cardápio não foi encontrado.', 1;
		end
	end
	else
	begin
		 THROW 51000, 'Cliente não encontrado.', 1;
	end
end


create or alter procedure SabDiv.calcularEinserirPrecoTotal
	@nomeUsuario varchar(100)
as
begin
	declare @idCliente int
    select @idCliente = IdCliente from SabDiv.Clientes where NomeUsuario = @nomeUsuario
	if @idCliente <> 0
	begin
		declare @ultimoIdPedido int
		select @ultimoIdPedido = max(IdPedido)
		FROM SabDiv.Pedidos
		WHERE IdCliente = @idCliente;

		if @ultimoIdPedido <> 0
		begin
			declare @precoTotal decimal(10,2)
			select @precoTotal = sum(IC.Preco * IP.Quantidade)
			from
				SabDiv.Pedidos as P
			join
				SabDiv.ItensDePedidos as IP on P.IdPedido = IP.IdPedido
			join
				SabDiv.ItensDeCardapios as IC on IP.IdItemDeCardapio = IC.IdItemDeCardapio
			where P.IdPedido = @ultimoIdPedido
			group by
				P.IdPedido;

			update SabDiv.Pedidos
			set PrecoTotal = @precoTotal
			where IdPedido = @ultimoIdPedido
		end
		else
		begin
			THROW 51000, 'Pedido não encontrado.', 1;
		end
	end
	else
		THROW 51000, 'Cliente não encontrado.', 1;
end