import db from '../config/db.js'; // Ajuste conforme seu arquivo de conexão

export const listarProdutos = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM produtos ORDER BY id ASC');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar produtos' });
    }
};

export const criarProduto = async (req, res) => {
    const { nome, categoria, sku, status, estoque, preco } = req.body;
    try {
        const query = 'INSERT INTO produtos (nome, categoria, sku, status, estoque, preco) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
        const result = await db.query(query, [nome, categoria, sku, status, estoque, preco]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar produto' });
    }
};

export const atualizarProduto = async (req, res) => {
    const { id } = req.params;
    const { nome, categoria, sku, status, estoque, preco } = req.body;
    try {
        const query = 'UPDATE produtos SET nome=$1, categoria=$2, sku=$3, status=$4, estoque=$5, preco=$6 WHERE id=$7';
        await db.query(query, [nome, categoria, sku, status, estoque, preco, id]);
        res.status(200).json({ message: 'Produto atualizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
};

export const excluirProduto = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM produtos WHERE id=$1', [id]);
        res.status(200).json({ message: 'Produto excluído' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao excluir produto' });
    }
};