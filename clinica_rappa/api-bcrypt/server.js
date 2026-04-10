import app from './app.js'; // Ajuste o caminho se o app.js estiver em outra pasta

// Define a porta: usa a do arquivo .env (se existir) ou a 3000 como padrão
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`🔗 Acesse: http://localhost:${PORT}`);
});