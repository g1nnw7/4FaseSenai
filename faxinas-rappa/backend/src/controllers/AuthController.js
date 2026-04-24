const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

class AuthController {
  static async register(req, res) {
    try {
      const { name, email, password, phone } = req.body;

      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: 'E-mail já cadastrado.' });
      }

      const user = await UserModel.create({ name, email, password, role: 'USER', phone });

      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      return res.status(201).json({
        message: 'Usuário criado com sucesso.',
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      });
    } catch (error) {
      console.error('Register error:', error);
      return res.status(500).json({ error: 'Erro interno ao registrar usuário.' });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas.' });
      }

      const isValid = await UserModel.comparePassword(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: 'Credenciais inválidas.' });
      }

      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      return res.json({
        message: 'Login realizado com sucesso.',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          clt_status: user.clt_status || null,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ error: 'Erro interno ao fazer login.' });
    }
  }

  static async me(req, res) {
    try {
      return res.json({ user: req.user });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar perfil.' });
    }
  }
}

module.exports = AuthController;