const UserModel = require('../models/UserModel');
const CltProfileModel = require('../models/CltProfileModel');

class UserController {
  // ADMIN: listar todos
  static async index(req, res) {
    try {
      const { role } = req.query;
      const users = role ? await UserModel.findByRole(role) : await UserModel.findAll();
      return res.json({ users });
    } catch (error) {
      console.error('UserController.index:', error);
      return res.status(500).json({ error: 'Erro ao buscar usuários.' });
    }
  }

  // ADMIN: buscar por ID
  static async show(req, res) {
    try {
      const user = await UserModel.findById(req.params.id);
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
      return res.json({ user });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar usuário.' });
    }
  }

  // ADMIN: criar CLT ou ADMIN
  static async createClt(req, res) {
    try {
      const { name, email, password, phone } = req.body;

      const existing = await UserModel.findByEmail(email);
      if (existing) return res.status(409).json({ error: 'E-mail já cadastrado.' });

      const user = await UserModel.create({ name, email, password, role: 'CLT', phone });
      return res.status(201).json({ message: 'CLT criado com sucesso.', user });
    } catch (error) {
      console.error('createClt:', error);
      return res.status(500).json({ error: 'Erro ao criar CLT.' });
    }
  }

  static async createAdmin(req, res) {
    try {
      const { name, email, password, phone } = req.body;

      const existing = await UserModel.findByEmail(email);
      if (existing) return res.status(409).json({ error: 'E-mail já cadastrado.' });

      const user = await UserModel.create({ name, email, password, role: 'ADMIN', phone });
      return res.status(201).json({ message: 'Admin criado com sucesso.', user });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao criar admin.' });
    }
  }

  // ADMIN: editar qualquer usuário
  static async update(req, res) {
    try {
      const { name, email, phone } = req.body;
      const user = await UserModel.update(req.params.id, { name, email, phone });
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
      return res.json({ message: 'Usuário atualizado.', user });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar usuário.' });
    }
  }

  // ADMIN: deletar
  static async delete(req, res) {
    try {
      const deleted = await UserModel.delete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Usuário não encontrado.' });
      return res.json({ message: 'Usuário removido com sucesso.' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao remover usuário.' });
    }
  }

  // CLT: atualizar próprio status
  static async updateCltStatus(req, res) {
    try {
      const { status } = req.body;
      const validStatuses = ['disponivel', 'em_faxina', 'indisponivel'];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Status inválido.' });
      }

      if (req.user.role !== 'CLT') {
        return res.status(403).json({ error: 'Apenas CLTs podem atualizar este status.' });
      }

      const profile = await CltProfileModel.updateStatus(req.user.id, status);
      if (!profile) return res.status(404).json({ error: 'Perfil CLT não encontrado.' });

      return res.json({ message: 'Status atualizado.', status: profile.status });
    } catch (error) {
      console.error('updateCltStatus:', error);
      return res.status(500).json({ error: 'Erro ao atualizar status.' });
    }
  }

  // Listar CLTs disponíveis para agendamento
  static async availableCLTs(req, res) {
    try {
      const clts = await UserModel.findAvailableCLTs();
      return res.json({ clts });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar CLTs disponíveis.' });
    }
  }

  // Usuário editar próprio perfil
  static async updateSelf(req, res) {
    try {
      const { name, phone } = req.body;
      const user = await UserModel.update(req.user.id, { name, email: req.user.email, phone });
      return res.json({ message: 'Perfil atualizado.', user });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar perfil.' });
    }
  }
}

module.exports = UserController;