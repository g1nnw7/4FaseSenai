const FaxinaModel = require('../models/FaxinaModel');
const CltProfileModel = require('../models/CltProfileModel');

class FaxinaController {
  // ADMIN: ver todas as faxinas
  static async index(req, res) {
    try {
      const filters = {};
      if (req.query.status) filters.status = req.query.status;
      if (req.query.cltId) filters.cltId = req.query.cltId;
      if (req.query.date) filters.date = req.query.date;

      const faxinas = await FaxinaModel.findAll(filters);
      return res.json({ faxinas });
    } catch (error) {
      console.error('FaxinaController.index:', error);
      return res.status(500).json({ error: 'Erro ao buscar faxinas.' });
    }
  }

  // CLT: ver suas próprias faxinas
  static async myCltFaxinas(req, res) {
    try {
      const faxinas = await FaxinaModel.findByCltId(req.user.id);
      return res.json({ faxinas });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar faxinas.' });
    }
  }

  // USER: ver suas próprias faxinas
  static async myFaxinas(req, res) {
    try {
      const faxinas = await FaxinaModel.findByUserId(req.user.id);
      return res.json({ faxinas });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar faxinas.' });
    }
  }

  static async show(req, res) {
    try {
      const faxina = await FaxinaModel.findById(req.params.id);
      if (!faxina) return res.status(404).json({ error: 'Faxina não encontrada.' });

      // CLT só pode ver as próprias
      if (req.user.role === 'CLT' && faxina.clt_id !== req.user.id) {
        return res.status(403).json({ error: 'Acesso negado.' });
      }

      // USER só pode ver as próprias
      if (req.user.role === 'USER' && faxina.user_id !== req.user.id) {
        return res.status(403).json({ error: 'Acesso negado.' });
      }

      return res.json({ faxina });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar faxina.' });
    }
  }

  // USER: agendar faxina
  static async create(req, res) {
    try {
      const { cltId, addressId, scheduledDate, scheduledTime, durationHours, propertyType, squareMeters, observations } = req.body;

      // Verificar se CLT está disponível
      const cltProfile = await CltProfileModel.findByUserId(cltId);
      if (!cltProfile || cltProfile.status !== 'disponivel') {
        return res.status(400).json({ error: 'CLT não está disponível para agendamento.' });
      }

      // Verificar conflito de horário do CLT
      const cltConflict = await FaxinaModel.checkCltConflict(cltId, scheduledDate, scheduledTime);
      if (cltConflict) {
        return res.status(409).json({ error: 'Este CLT já tem uma faxina agendada neste horário.' });
      }

      // Verificar conflito de horário do USER
      const userConflict = await FaxinaModel.checkUserConflict(req.user.id, scheduledDate, scheduledTime);
      if (userConflict) {
        return res.status(409).json({ error: 'Você já tem uma faxina agendada neste horário.' });
      }

      const faxina = await FaxinaModel.create({
        userId: req.user.id,
        cltId,
        addressId,
        scheduledDate,
        scheduledTime,
        durationHours: durationHours || 3,
        propertyType: propertyType || 'residencial',
        squareMeters,
        observations,
        price: null,
      });

      return res.status(201).json({ message: 'Faxina agendada com sucesso!', faxina });
    } catch (error) {
      console.error('FaxinaController.create:', error);
      return res.status(500).json({ error: 'Erro ao agendar faxina.' });
    }
  }

  // ADMIN: editar qualquer faxina
  static async adminUpdate(req, res) {
    try {
      const faxina = await FaxinaModel.findById(req.params.id);
      if (!faxina) return res.status(404).json({ error: 'Faxina não encontrada.' });

      const updated = await FaxinaModel.update(req.params.id, req.body);
      return res.json({ message: 'Faxina atualizada.', faxina: updated });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar faxina.' });
    }
  }

  // CLT: editar status da própria faxina
  static async cltUpdate(req, res) {
    try {
      const faxina = await FaxinaModel.findById(req.params.id);
      if (!faxina) return res.status(404).json({ error: 'Faxina não encontrada.' });

      if (faxina.clt_id !== req.user.id) {
        return res.status(403).json({ error: 'Você só pode editar suas próprias faxinas.' });
      }

      const { status, observations } = req.body;
      const updated = await FaxinaModel.update(req.params.id, { status, observations });
      return res.json({ message: 'Faxina atualizada.', faxina: updated });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar faxina.' });
    }
  }

  // USER: cancelar faxina (somente com 24h de antecedência)
  static async cancel(req, res) {
    try {
      const faxina = await FaxinaModel.findById(req.params.id);
      if (!faxina) return res.status(404).json({ error: 'Faxina não encontrada.' });

      if (faxina.user_id !== req.user.id) {
        return res.status(403).json({ error: 'Você só pode cancelar suas próprias faxinas.' });
      }

      if (faxina.status !== 'agendada') {
        return res.status(400).json({ error: 'Apenas faxinas agendadas podem ser canceladas.' });
      }

      if (!FaxinaModel.canCancel(faxina.scheduled_date, faxina.scheduled_time)) {
        return res.status(400).json({ error: 'Não é possível cancelar faxinas com menos de 24 horas de antecedência.' });
      }

      const cancelled = await FaxinaModel.cancel(req.params.id);
      return res.json({ message: 'Faxina cancelada com sucesso.', faxina: cancelled });
    } catch (error) {
      console.error('cancel:', error);
      return res.status(500).json({ error: 'Erro ao cancelar faxina.' });
    }
  }
}

module.exports = FaxinaController;