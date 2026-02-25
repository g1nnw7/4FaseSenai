import db from '../config/db.js';

const getProdutos = async (req, res) => {
	try {
		const [resultado] = await db.query("SELECT id, nome, descricao, valor FROM produto where ativo = 1");

		if (resultado.length === 0) {
			return res.status(404).json({ message: "Nenhum produto encontrado" });
		}
		return res.status(200).json({ message: "Produtos encontrados", data: resultado });
	} catch (error) {
		return res.status(500).json({ message: "Erro ao buscar produtos", error: error.message });
	}
};

const editarProduto = async (req, res) => {
	try {
		const nomeProduto = req.body.nome;
		const descricao = req.body.descricao;
		const valor = req.body.valor;
		const id = req.params.id;
		const [resultado] = await db.query("UPDATE produto SET nome = ?, descricao = ?, valor = ?, WHERE id = ?", [nomeProduto, descricao, valor]);
		if (resultado.affectedRows === 0)
			res.status(400).json({ message: "Produto não encontrado" })

		return res.status(200).json({ message: "Produto Atualizado com sucesso." })
	} catch (error) {
		res.status(400).json({ message: "Erro ao editar produto.", error: error.message })
	}
}

const excluirProduto = async (req, res) => {
	try {
		const id = req.params.id

		const [resultado] = await db.query("DELETE FROM produto WHERE id = ?", [id])
		if (resultado.affectedRows === 0)
			res.status(400).json({ message: "Produto não encontrado" })

		return res.status(200).json({ message: "Produto deletado com sucesso." })
	} catch (error) {
		return res.status(400).json({ message: "Erro ao deletar produto.", error: error.message })
	}
}

const adicionarProduto = async (req, res) => {
	const nome = req.body.nome
	const descricao = req.body.descricao
	const valor = req.body.valor
	try {
		const [resultado] = await db.query("INSERT INTO produto (nome, descricao, valor) VALUES (?, ?, ?)", [nome, valor, descricao])
		if (resultado.affectedRows === 0)
			res.status(400).json({ message: "Produto não foi criado" })

		return res.status(201).json({ message: "Produto criado com sucesso." })
	} catch (error) {
		return res.status(400).json({ message: "Erro ao criar produto.", error: error.message })
	}
}

export { getProdutos, editarProduto, excluirProduto, adicionarProduto };