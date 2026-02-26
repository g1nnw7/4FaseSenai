import { useEffect, useState } from "react";
import { 
  getProdutos, 
  adicionarProduto, 
  editarProduto, 
  excluirProduto 
} from "../services/produtos";

import ModalProduto from "./ModalProduto";
import EditarProduto from "./EditarProduto";

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
  
  /**  
   * Salvar faz duas coisas dependendo do modo:  
   * - add  -> POST  
   * - edit -> PATCH  
   */  
  const salvar = async () => {  
    try {  
      // Monta o payload do jeito que o backend espera  
      const payload = {  
        nome: tituloEdit,  
        descricao: descricaoEdit,  
        // converte para número; se vier vazio, vira 0 (você pode validar se quiser)  
        valor: Number(valorEdit),  
      };  
  
      if (modo === "add") {  
        const ok = await adicionarProduto(payload);  
        if (!ok) {  
          console.log("Não foi possível adicionar o produto");  
          return;  
        }  
      } else {  
        // modo edit: precisa ter um produto selecionado  
        if (!produtoSelecionado?.id) {  
          console.log("Nenhum produto selecionado para editar");  
          return;  
        }  
  
        const ok = await editarProduto(produtoSelecionado.id, payload);  
        if (!ok) {  
          console.log("Não foi possível editar o produto");  
          return;  
        }  
      }  
  
      // Depois de adicionar/editar, recarregamos do backend (mais simples e confiável)  
      await carregarProdutos();  
  
      fecharModal();  
    } catch (e) {  
      console.log("Erro ao salvar:", e);  
    }  
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
            <th>Ação</th>  
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
                <button className="btn btn-danger" onClick={{}}>  
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