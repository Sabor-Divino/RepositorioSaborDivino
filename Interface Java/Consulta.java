public class Consulta{
    private int IdItemDeCardapio;
    private String NomeItem;
    private double Preco;
    private int IdCardapio;

    public Consulta(int IdItemDeCardapio, String NomeItem, double Preco, int IdCardapio) {
        this.IdItemDeCardapio = IdItemDeCardapio;
        this.NomeItem = NomeItem;
        this.Preco = Preco;
        this.IdCardapio = IdCardapio;
    }

    public Object[] toArray() {
        return new Object[]{IdItemDeCardapio, NomeItem, Preco, IdCardapio};
    }
}