create view SabDiv.itensCardapioLanches
as
select NomeItem, Preco
from SabDiv.ItensDeCardapios
where IdCardapio = 1 and NomeItem <> 'Indispon�vel'


create view SabDiv.itensCardapioSobremesas
as
select NomeItem, Preco
from SabDiv.ItensDeCardapios
where IdCardapio = 2 and NomeItem <> 'Indispon�vel'

create view SabDiv.itensCardapioBebidas
as
select NomeItem, Preco
from SabDiv.ItensDeCardapios
where IdCardapio = 3 and NomeItem <> 'Indispon�vel'