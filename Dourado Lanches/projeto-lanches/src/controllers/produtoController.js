import db from '../config/db.js';

const getProdutos = async (req, res) => {
	try {
		const [resultado] = await db.query("SELECT id, nome, descricao, valor FROM produto where ativo = 1");

		if(resultado.length === 0) {
			return res.status(404).json({ message: "Nenhum produto encontrado" });
		}
		return res.status(200).json({ message: "Produtos encontrados", data: resultado });
	} catch (error) {
		return res.status(500).json({ message: "Erro ao buscar produtos", error: error.message });
	}
};

//criar funçção editar
const editarProduto = async (req, res) => {
	try {
		const [resultado] = await db.query("UPDATE produto SET nome = ?, descricao = ?, valor = ? WHERE id = ?", [req.body.nome, req.body.descricao, req.body.valor, req.params.id]);

		if (resultado.affectedRows === 0) {  
			return res.status(404).json({ message: "Produto não encontrado" });  
		}
		return res.status(200).json({ message: "Produto editado com sucesso", data: resultado });
	} catch (error) {
		return res.status(500).json({ message: "Erro ao editar produto", error: error.message });
	}
}

//criar função deletar
const deletarProduto = async (req, res) => {
	try {
		// const [resultado] = await db.query("UPDATE produto SET ativo = 0 WHERE id = ?", [req.params.id]);
		const [resultado] = await db.query("DELETE FROM produto WHERE id = ?", [req.params.id]);

		if (resultado.affectedRows === 0) {  
			return res.status(404).json({ message: "Produto não encontrado" });  
		}
		return res.status(200).json({ message: "Produto deletado com sucesso", data: resultado });
	} catch (error) {
		return res.status(500).json({ message: "Erro ao deletar produto", error: error.message });
	}
}

// criar funcao adicionar
const adicionarProduto = async (req, res) => {
    try {
		const [resultado] = await db.query("INSERT INTO produto (nome, descricao, valor) VALUES (?, ?, ?)", [req.body.nome, req.body.descricao, req.body.valor]);

		if(resultado.affectedRows === 0) {
			return res.status(404).json({ message: "Nenhum produto adicionado" });
		}

		return res.status(201).json({ message: "Produto adicionado com sucesso", data: resultado });
	} catch (error) {
		return res.status(500).json({ message: "Erro ao adicionar produto", error: error.message });
	}
}

export { getProdutos, editarProduto, deletarProduto, adicionarProduto };