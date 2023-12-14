import java.awt.*;
import java.awt.event.*;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import javax.swing.*;
import javax.swing.table.DefaultTableModel;

public class Interface { 
    private static final String JDBC_DRIVER = "com.microsoft.sqlserver.jdbc.SQLServerDriver";
    private static final String DB_URL = "jdbc:sqlserver://regulus.cotuca.unicamp.br:1433;databaseName=BD23331;trustServerCertificate=true";
    private static final String USER = "BD23331";
    private static final String PASS = "BD23331";
    private Connection conn;
    private JFrame frame;
    private JTextField userField;
    private JPasswordField passField;
    private JButton btnLogin;
    private JTable table;
    private DefaultTableModel tableModel;

    public static void main(String[] args) {
        EventQueue.invokeLater(() -> {
            try {
                Interface window = new Interface();
                window.frame.setVisible(true);
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }

    public Interface() {
        connectToDatabase();
        initialize();
    }

    private void initialize() {
        frame = new JFrame();
        frame.setBounds(100, 100, 800, 600);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.getContentPane().setLayout(new BorderLayout());

        JPanel loginPanel = createLoginPanel();
        frame.getContentPane().add(loginPanel, BorderLayout.NORTH);

        JPanel itensPanel = createitensPanel();
        frame.getContentPane().add(itensPanel, BorderLayout.CENTER);
        itensPanel.setVisible(false);
    }

    private JPanel createLoginPanel() {
        JPanel loginPanel = new JPanel(new GridBagLayout());
    
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(10, 10, 10, 10);
    
        JLabel lblUser = new JLabel("Usuário:");
        loginPanel.add(lblUser, gbc);
    
        gbc.gridy++;
        userField = new JTextField(10);
        loginPanel.add(userField, gbc);
    
        gbc.gridy++;
        JLabel lblPass = new JLabel("Senha:");
        loginPanel.add(lblPass, gbc);
    
        gbc.gridy++;
        passField = new JPasswordField(10);
        loginPanel.add(passField, gbc);
    
        gbc.gridy++;
        btnLogin = new JButton("Entrar");
        btnLogin.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                String usuarioDigitado = userField.getText();
                String senhaDigitada = new String(passField.getPassword());
                if (usuarioDigitado.equals(USER) && senhaDigitada.equals(PASS)) {
                    selectItens();
                } else {
                    JOptionPane.showMessageDialog(frame, "Login falhou. Verifique suas credenciais.");
                }
            }
        });
        gbc.gridy++;
        loginPanel.add(btnLogin, gbc);
        return loginPanel; 
    }

    private JPanel createitensPanel() {
        JPanel itensPanel = new JPanel(new BorderLayout());

        tableModel = new DefaultTableModel();
        tableModel.addColumn("IdItemDeCardapio");
        tableModel.addColumn("NomeItem");
        tableModel.addColumn("Preco");
        tableModel.addColumn("IdCardapio");

        table = new JTable(tableModel);
        JScrollPane scrollPane = new JScrollPane(table);
        itensPanel.add(scrollPane, BorderLayout.CENTER);

        JPanel buttonPanel = new JPanel();

        JButton btnAdicionarItem = new JButton("Adicionar item");
        btnAdicionarItem.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                abrirInserirItemDeCardapio();
            }
            
        });

        JButton btnAlterarItem = new JButton("Alterar Item");
        btnAlterarItem.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                abrirAlterarItem();
            }
        });

        JButton btnExcluirItem = new JButton("Excluir item");
        btnExcluirItem.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                abrirExcluirItem();
            }
        });

        buttonPanel.add(btnAdicionarItem);
        buttonPanel.add(btnAlterarItem);
        buttonPanel.add(btnExcluirItem);
        itensPanel.add(buttonPanel, BorderLayout.SOUTH);

        return itensPanel;
    }

    private void connectToDatabase() {
        try {
            conn = DriverManager.getConnection(DB_URL, USER, PASS);
            System.out.println("Conexão com o banco de dados estabelecida com sucesso.");
        } catch (SQLException e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(frame, "Erro ao conectar ao banco de dados. Verifique o console para mais detalhes: " + e.getMessage());
        }
    }

    private List<Consulta> obterItensDeCardapioPorId(int idCardapio) {
        List<Consulta> Itens = new ArrayList<>();
        String sql = "SELECT * FROM SabDiv.ItensDeCardapios WHERE IdCardapio = ?";

        try (PreparedStatement preparedStatement = conn.prepareStatement(sql)) {
            preparedStatement.setInt(1, idCardapio);
            ResultSet resultSet = preparedStatement.executeQuery();
    
            while (resultSet.next()) {
                int idItemDeCardapio = resultSet.getInt("IdItemDeCardapio");
                String nomeItem = resultSet.getString("NomeItem");
                double preco = resultSet.getDouble("Preco");
                int idCardapioC = resultSet.getInt("IdCardapio");
                Consulta consulta = new Consulta(idItemDeCardapio, nomeItem, preco, idCardapioC);
                Itens.add(consulta);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return Itens;
    }

    private void adicionarItensATabela(List<Consulta> Itens, String nomeCardapio) {
        tableModel.addRow(new Object[]{"Itens do " + nomeCardapio});

        for (Consulta consulta : Itens) {
            tableModel.addRow(consulta.toArray());
        }
        tableModel.addRow(new Object[]{});
    }

    private void selectItens() {
        frame.getContentPane().getComponent(0).setVisible(false);
        frame.getContentPane().getComponent(1).setVisible(true);
    
        List<Consulta> lanches = obterItensDeCardapioPorId(1);
        List<Consulta> bebidas = obterItensDeCardapioPorId(2);
        List<Consulta> sobremesas = obterItensDeCardapioPorId(3);
    
        tableModel.setRowCount(0);
    
        adicionarItensATabela(lanches, "Cardápio de Lanches");
        adicionarItensATabela(bebidas, "Cardápio de Bebidas");
        adicionarItensATabela(sobremesas, "Cardápio de Sobremesas");
    }

   private void abrirInserirItemDeCardapio() {
        JFrame inserirFrame = new JFrame("Adicionar item");
        inserirFrame.setBounds(100, 100, 400, 300);
        inserirFrame.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        inserirFrame.getContentPane().setLayout(new BorderLayout());

        JTextField nomeItemField = new JTextField();
        JTextField precoField = new JTextField();
        JTextField idCardapioField = new JTextField();

        JButton btnAdicionarItem = new JButton("Adicionar item");
        btnAdicionarItem.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                inserirItem(
                        nomeItemField.getText(),
                        precoField.getText(),
                        idCardapioField.getText()
                );
                inserirFrame.dispose();
            }
        });

        JButton btnVoltar = new JButton("Voltar");
        btnVoltar.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                inserirFrame.dispose();
            }
        });

        JPanel formPanel = new JPanel(new GridLayout(7, 2, 5, 5));
        formPanel.add(new JLabel("Nome item:"));
        formPanel.add(nomeItemField);
        formPanel.add(new JLabel("Preco:"));
        formPanel.add(precoField);
        formPanel.add(new JLabel("Id Cardapio:"));
        formPanel.add(idCardapioField);

        JPanel buttonPanel = new JPanel();
        buttonPanel.add(btnAdicionarItem);
        buttonPanel.add(btnVoltar);

        inserirFrame.add(formPanel, BorderLayout.CENTER);
        inserirFrame.add(buttonPanel, BorderLayout.SOUTH);

        inserirFrame.setVisible(true);
    }

    private void abrirAlterarItem() {
        JFrame alterarFrame = new JFrame("Alterar item");
        alterarFrame.setBounds(100, 100, 400, 200);
        alterarFrame.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        alterarFrame.getContentPane().setLayout(new GridLayout(5, 2, 5, 5));
    
        JLabel lblIdItem = new JLabel("ID do Item:");
        JTextField idItemDeCardapioField = new JTextField();
        JLabel lblNomeItem = new JLabel("Novo Nome do Item:");
        JTextField nomeItemField = new JTextField();
        JLabel lblPreco = new JLabel("Novo Preço:");
        JTextField precoField = new JTextField();
        JLabel lblIdCardapio = new JLabel("Novo ID do Cardápio:");
        JTextField idCardapioField = new JTextField();
    
        JButton btnAlterarItem = new JButton("Alterar item");
        btnAlterarItem.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                alterarItem(
                        idItemDeCardapioField.getText(),
                        nomeItemField.getText(),
                        precoField.getText(),
                        idCardapioField.getText()
                );
                alterarFrame.dispose();
            }
        });
    
        alterarFrame.add(lblIdItem);
        alterarFrame.add(idItemDeCardapioField);
        alterarFrame.add(lblNomeItem);
        alterarFrame.add(nomeItemField);
        alterarFrame.add(lblPreco);
        alterarFrame.add(precoField);
        alterarFrame.add(lblIdCardapio);
        alterarFrame.add(idCardapioField);
        alterarFrame.add(new JLabel());
        alterarFrame.add(btnAlterarItem);
    
        alterarFrame.setVisible(true);
    }

    private void abrirExcluirItem() {
        JFrame excluirFrame = new JFrame("Excluir item");
        excluirFrame.setBounds(100, 100, 300, 150);
        excluirFrame.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        excluirFrame.getContentPane().setLayout(new BorderLayout());
    
        JTextField idItemField = new JTextField();
        JButton btnExcluir = new JButton("Excluir");
    
        btnExcluir.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                int idItemParaExcluir = Integer.parseInt(idItemField.getText());
    
                excluirItem(idItemParaExcluir);

                excluirFrame.dispose();
            }
        });
    
        JPanel formPanel = new JPanel(new GridLayout(2, 2, 5, 5));
        formPanel.add(new JLabel("ID do Item:"));
        formPanel.add(idItemField);
        formPanel.add(new JLabel());
        formPanel.add(btnExcluir);
    
        excluirFrame.add(formPanel, BorderLayout.CENTER);
        excluirFrame.setVisible(true);
    }
    
    
    private void excluirItem(int idItemDeCardapio) {
        if (ItemExiste(String.valueOf(idItemDeCardapio))) {
            int opcao = JOptionPane.showConfirmDialog(frame, "Tem certeza que deseja excluir este item?", "Confirmação", JOptionPane.YES_NO_OPTION);
    
            if (opcao == JOptionPane.YES_OPTION) {
                String sql = "DELETE FROM SabDiv.ItensDeCardapios WHERE IdItemDeCardapio = ?";
    
                try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
                    pstmt.setInt(1, idItemDeCardapio);
                    pstmt.executeUpdate();
                    
                    selectItens();
    
                    JOptionPane.showMessageDialog(frame, "Item excluído com sucesso.");
                } catch (SQLException e) {
                    e.printStackTrace();
                    JOptionPane.showMessageDialog(frame, "Erro ao excluir o item. Verifique o console para mais detalhes.");
                }
            }
        } else {
            JOptionPane.showMessageDialog(frame, "Item não encontrado.");
        }
    }
    
    
    private boolean ItemExiste(String idItem) {
        try {
            String sql = "SELECT 1 FROM SabDiv.ItensDeCardapios WHERE IdItemDeCardapio = ?";
            PreparedStatement pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1, Integer.parseInt(idItem));

            ResultSet rs = pstmt.executeQuery();

            return rs.next();
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("Erro ao verificar a existência do item: " + e.getMessage());
        }
        return false;
    }
    
    private void inserirItem(String nomeItemField, String precoField, String idCardapioField) {
        if (conn != null) {
            String sql = "INSERT INTO SabDiv.ItensDeCardapios (NomeItem, Preco, IdCardapio) VALUES (?, ?, ?)";
    
            try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
                pstmt.setString(1, nomeItemField);
                pstmt.setDouble(2, Double.parseDouble(precoField));
                pstmt.setInt(3, Integer.parseInt(idCardapioField));
                pstmt.executeUpdate();
                selectItens();
                JOptionPane.showMessageDialog(frame, "Item inserido com sucesso!");
            } catch (SQLException e) {
                e.printStackTrace();
                JOptionPane.showMessageDialog(frame, "Erro ao inserir item no banco de dados.");
            }
        } else {
            JOptionPane.showMessageDialog(frame, "Erro: Conexão com o banco de dados não estabelecida.");
        }
    }
    

    private void alterarItem(String idItemDeCardapio, String NomeItem, String Preco, String idCardapio) {
        if (ItemExiste(idItemDeCardapio)) {
            try {
                if (!NomeItem.isEmpty()) {
                    String sqlNome = "UPDATE SabDiv.ItensDeCardapios SET NomeItem = ? WHERE IdItemDeCardapio = ?";
                    try (PreparedStatement pstmt = conn.prepareStatement(sqlNome)) {
                        pstmt.setString(1, NomeItem);
                        pstmt.setInt(2, Integer.parseInt(idItemDeCardapio));
                        pstmt.executeUpdate();
                    }
                }

                if (!Preco.isEmpty()) {
                    String sqlPreco = "UPDATE SabDiv.ItensDeCardapios SET Preco = ? WHERE IdItemDeCardapio = ?";
                    try (PreparedStatement pstmt = conn.prepareStatement(sqlPreco)) {
                        pstmt.setDouble(1, Double.parseDouble(Preco));
                        pstmt.setInt(2, Integer.parseInt(idItemDeCardapio));
                        pstmt.executeUpdate();
                    }
                }

                if (!idCardapio.isEmpty()) {
                    String sqlIdCardapio = "UPDATE SabDiv.ItensDeCardapios SET IdCardapio = ? WHERE IdItemDeCardapio = ?";
                    try (PreparedStatement pstmt = conn.prepareStatement(sqlIdCardapio)) {
                        pstmt.setInt(1, Integer.parseInt(idCardapio));
                        pstmt.setInt(2, Integer.parseInt(idItemDeCardapio));
                        pstmt.executeUpdate();
                    }
                }
    
                selectItens();
                JOptionPane.showMessageDialog(frame, "Item alterado com sucesso.");
    
            } catch (SQLException e) {
                e.printStackTrace();
                JOptionPane.showMessageDialog(frame, "Erro ao alterar o item. Verifique o console para mais detalhes.");
            }
        } else {
            JOptionPane.showMessageDialog(frame, "Item não encontrado.");
        }
    }
    
}
