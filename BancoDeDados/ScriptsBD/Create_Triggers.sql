create trigger SabDiv.trAuditoriaItensDeCardapios
on SabDiv.ItensDeCardapios
after insert, update, delete
as
begin
	declare @acao varchar(10)
	set @acao = 'inser��o'

	if exists(select * from deleted)
	begin
		if exists(select * from inserted)
		set @acao = 'altera��o'
		else
		set @acao = 'remo��o'
	end
	
	declare @linhas int
	set @linhas = @@ROWCOUNT
	insert into SabDiv.AuditoriaItensDeCardapios
	values (@acao, getdate(), @linhas)
end;


create trigger SabDiv.trRestricaoIntegridadeClientes
on SabDiv.Clientes
instead of delete
as
begin
	if exists(select * from deleted d
			  inner join SabDiv.Pedidos p on d.IdCliente = p.IdCliente)
	begin
	THROW 50000, 'Cliente n�o pode ser exclu�do pois h� registros desse cliente', 1
	end

	else
	begin
	delete from SabDiv.Clientes
	where idCliente in (select IdCliente from deleted)
	end
end

create trigger SabDiv.trRestricaoIntegridadeItensDeCardapios
on SabDiv.ItensDeCardapios
instead of delete
as
begin
	if exists(select IdItemDeCardapio from SabDiv.ItensDePedidos
				where IdItemDeCardapio in (select IdItemDeCardapio from deleted))
	begin
		update SabDiv.ItensDeCardapios
		set NomeItem = '
		'
		where IdItemDeCardapio in (select IdItemDeCardapio from deleted)
	end
	else
	begin
		delete from SabDiv.ItensDeCardapios
		where IdItemDeCardapio in (select IdItemDeCardapio from deleted)
	end
end