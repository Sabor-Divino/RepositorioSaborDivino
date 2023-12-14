public class Consulta{
    private int idItemDeCardapio;
    private String nomeItem;
    private double preco;
    private int idCardapio;

    public Consulta(int idItemDeCardapio, String nomeItem, double preco, int idCardapio) throws Exception{
        if (idItemDeCardapio == 0) throw new Exception("Id item inválido");
        if (idCardapio == 0) throw new Exception("Id cardápio inválido");
        if(nomeItem.equals("")) throw new Exception("Nome item inválido");
        this.idItemDeCardapio = idItemDeCardapio;
        this.nomeItem = nomeItem;
        this.preco = preco;
        this.idCardapio = idCardapio;
    }

    public Object[] toArray() {
        return new Object[]{idItemDeCardapio, nomeItem, preco, idCardapio};
    }

    @Override
    public String toString(){
        String ret = "Id item: "+this.idItemDeCardapio+"\nNome item: "+this.nomeItem+"\nPreço: "+this.preco+"\nId cardápio: "+this.idCardapio;
        return ret;
    }

    @Override
    public int hashCode(){
        int ret = 1;

        ret += ret * 7 + Integer.valueOf(this.idItemDeCardapio).hashCode();
        ret += ret * 7 + String.valueOf(this.nomeItem).hashCode();
        ret += ret * 7 + Double.valueOf(this.preco).hashCode();
        ret += ret * 7 + Integer.valueOf(this.idCardapio).hashCode();

        return ret;
    }

    @Override
    public boolean equals(Object obj){
        if(obj == null) return false;
        if(obj == this) return true;
        if(obj.getClass() != this.getClass()) return false;

        Consulta con = (Consulta) (obj);
        if(con.idItemDeCardapio != this.idItemDeCardapio) return false;
        if(con.nomeItem != this.nomeItem) return false;
        if(con.preco != this.preco) return false;
        if(con.idCardapio != this.idCardapio) return false;
        return true;
    }
}
