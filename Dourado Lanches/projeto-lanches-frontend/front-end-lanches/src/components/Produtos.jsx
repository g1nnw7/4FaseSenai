import { useEffect, useState } from "react";
import { getProdutos, adicionarProduto, editarProduto, excluirProduto } from "../services/produtos";

import ModalProduto from "./ModalProduto";
import EditarProduto from "./EditarProduto";

const salvar = () => {

}

const Produtos = () => {
  // Lista que vem do backend (array de produtos)  
  const [produtos, setProdutos] = useState([]);

  // Controle do modal  
  const [modal, setModal] = useState(false);

  // Produto escolhido para editar (quando modo === "edit")  
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  // Define se o modal está em modo adicionar ou editar  
  const [modo, setModo] = useState("edit"); // "add" | "edit"  

  // Estados do formulário (inputs)  
  const [tituloEdit, setTituloEdit] = useState("");
  const [descricaoEdit, setDescricaoEdit] = useState("");
  const [valorEdit, setValorEdit] = useState("");

  /**  
   * Busca produtos no backend e guarda no state.  
   * Dica: como getProdutos() agora retorna array, fica simples.  
   */
  const carregarProdutos = async () => {
    try {
      const lista = await getProdutos();
      setProdutos(lista); // lista é array  
    } catch (error) {
      console.log("Erro ao carregar produtos:", error);
      setProdutos([]); // garante que a tabela não quebre  
    }
  };

  // Carrega 1 vez quando o componente monta  
  useEffect(() => {
    carregarProdutos();
  }, []);

  /**  
   * Abre modal no modo "edit" e preenche os inputs com o produto clicado  
   */
  const abrirModalEditar = (produto) => {
    setModo("edit");
    setProdutoSelecionado(produto);

    // Preenche form com os dados do produto  
    setTituloEdit(produto.nome ?? "");
    setDescricaoEdit(produto.descricao ?? "");
    setValorEdit(produto.valor ?? "");

    setModal(true);
  };

  /**  
   * Abre modal no modo "add" com inputs vazios  
   */
  const abrirModalAdicionar = () => {
    setModo("add");
    setProdutoSelecionado(null);

    setTituloEdit("");
    setDescricaoEdit("");
    setValorEdit("");

    setModal(true);
  };

  const fecharModal = () => {
    setModal(false);
    setProdutoSelecionado(null);
  };



  return (
    <div className="container">
      <h2>Produtos Dourado Lanches</h2>

      <button className="btn btn-warning" onClick={abrirModalAdicionar}>
        Adicionar
      </button>

      <br />
      <br />

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Preço</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {produtos && produtos.map((p) => (
            <tr key={p.id}>
              <td>{p.nome}</td>
              <td>{p.descricao}</td>
              <td>{p.valor}</td>
              <td>
                <button className="btn btn-primary" onClick={() => abrirModalEditar(p)}>
                  Editar
                </button>
                &nbsp;
                <button className="btn btn-danger">
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ModalProduto
        open={modal}
        onClose={fecharModal}
        onSave={salvar}
        title={modo === "add" ? "Adicionar produto" : (produtoSelecionado?.nome ?? "Editar produto")}
      >
        <EditarProduto
          titulo={tituloEdit}
          descricao={descricaoEdit}
          valor={valorEdit}
          onChangeTitulo={setTituloEdit}
          onChangeDescricao={setDescricaoEdit}
          onChangeValor={setValorEdit}
        />
      </ModalProduto>
    </div>
  );
};

export default Produtos;