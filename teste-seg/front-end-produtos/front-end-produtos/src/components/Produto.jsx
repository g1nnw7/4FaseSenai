import { useState } from "react"
import { getProdutos } from "../services/produto"

const Produto = () => {
    const [produtos, setProdutos] = useState([])

    const carregaProduto = async () => {
        try {
            const lista = await getProdutos();
            setProdutos(lista)
        } catch (error) {
            return res.status(400).json({ message: "Erro ao buscar os produtos" })
        }
    }
    return (
        <>
            <h1>Dourado Lanches</h1>

            <button className="btn btn-danger">Adicionar</button>

            <table>
                <thead>
                    <th>Nome</th>
                    <th>Descrição</th>
                    <th>Valor</th>
                </thead>
            </table>
            <tbody>
                {
                    produtos.map((p) => (
                        <tr key={p.id}>
                            <td>{p.nome}</td>
                            <td>{p.descricao}</td>
                            <td>{p.valor}</td>
                        </tr>
                    ))
                }
            </tbody>
        </>
    )
}

export default Produto