const EditarProduto = ({ titulo, descricao, valor, onChangeTitulo, onChangeDescricao, onChangeValor }) => {
  return (
    <div>
      <div className="mb-3">
        <label htmlFor="titulo" className="form-label">Nome</label>
        <input
          type="text"
          className="form-control"
          id="titulo"
          value={titulo}
          onChange={(e) => onChangeTitulo(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="descricao" className="form-label">Descrição</label>
        <textarea
          className="form-control"
          id="descricao"
          rows="3"
          value={descricao}
          onChange={(e) => onChangeDescricao(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="valor" className="form-label">Preço</label>
        <input
          type="number"
          className="form-control"
          id="valor"
          value={valor}
          onChange={(e) => onChangeValor(e.target.value)}
          step="0.01"
        />
      </div>
    </div>
  );
};

export default EditarProduto;