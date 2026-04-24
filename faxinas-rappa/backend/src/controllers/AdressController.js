const AddressModel = require('../models/AddressModel');

class AddressController {
  static async index(req, res) {
    try {
      const addresses = await AddressModel.findByUserId(req.user.id);
      return res.json({ addresses });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar endereços.' });
    }
  }

  static async create(req, res) {
    try {
      const { street, number, complement, neighborhood, city, state, zipCode } = req.body;
      const address = await AddressModel.create({
        userId: req.user.id,
        street, number, complement, neighborhood, city, state, zipCode
      });
      return res.status(201).json({ message: 'Endereço adicionado.', address });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao criar endereço.' });
    }
  }

  static async delete(req, res) {
    try {
      const deleted = await AddressModel.delete(req.params.id, req.user.id);
      if (!deleted) return res.status(404).json({ error: 'Endereço não encontrado.' });
      return res.json({ message: 'Endereço removido.' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao remover endereço.' });
    }
  }
}

module.exports = AddressController;