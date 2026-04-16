import jwt from 'jsonwebtoken';

export function autenticarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Token de acesso necessário' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido ou expirado' });
        }
        req.usuario = usuario;
        next();
    });
}

export function apenasDoctor(req, res, next) {
    if (!req.usuario || req.usuario.role !== 'DOCTOR') {
        return res.status(403).json({ error: 'Acesso restrito a médicos' });
    }
    next();
}

export function apenasUser(req, res, next) {
    if (!req.usuario || req.usuario.role !== 'USER') {
        return res.status(403).json({ error: 'Acesso restrito a pacientes' });
    }
    next();
}