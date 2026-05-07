const jwt = require('jsonwebtoken');

// Verifica se o usuário tem um token válido logado
function verificarToken(req, res, next) {
  // Pega o token do cabeçalho da requisição
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' });
  }

  try {
    // A senha 'secreta123' deve ser a mesma usada lá no UsuarioController!
    const decodificado = jwt.verify(token, 'secreta123');
    req.usuario = decodificado; // Salva os dados do usuário na requisição
    next(); // Permite que a rota continue
  } catch (error) {
    return res.status(400).json({ erro: 'Token inválido.' });
  }
}

// Verifica se o perfil do usuário logado é ADMIN
function ehAdmin(req, res, next) {
  // Lembrando que a palavra ADMIN deve estar igual à que você salvou no banco
  if (req.usuario.perfil !== 'ADMIN') {
    return res.status(403).json({ erro: 'Acesso negado. Apenas administradores.' });
  }
  next(); // Permite que a rota continue
}

// O erro no servidor acontece se você esquecer essa linha abaixo:
module.exports = { verificarToken, ehAdmin };