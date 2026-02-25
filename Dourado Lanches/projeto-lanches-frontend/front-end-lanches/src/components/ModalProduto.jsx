const ModalProduto = ({ open, onClose, title, children, onSave }) => {
  if (!open) return null;

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} />

      <div
        className="modal fade show"
        tabIndex={-1}
        role="dialog"
        aria-hidden={!open}
        style={{ display: "block" }}
        onClick={onClose}
      >
        <div className="modal-dialog" role="document" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
            </div>

            <div className="modal-body">
              {children}
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Fechar
              </button>
              <button type="button" className="btn btn-primary" onClick={onSave}>
                Salvar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalProduto;