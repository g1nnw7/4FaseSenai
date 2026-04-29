const FaxinaModel = require('../models/FaxinaModel');
const CltProfileModel = require('../models/CltProfileModel');

class FaxinaController {
  static async index(req, res) {
    try {
      const filters = {};
      if (req.query.status) filters.status = req.query.status;
      if (req.query.cltId)  filters.cltId  = req.query.cltId;
      if (req.query.date)   filters.date   = req.query.date;
      const faxinas = await FaxinaModel.findAll(filters);
      return res.json({ faxinas });
    } catch (error) {
      console.error('FaxinaController.index:', error);
      return res.status(500).json({ error: 'Erro ao buscar faxinas.' });
    }
  }

  static async myCltFaxinas(req, res) {
    try {
      const faxinas = await FaxinaModel.findByCltId(req.user.id);
      return res.json({ faxinas });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar faxinas.' });
    }
  }

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

      if (req.user.role === 'CLT'  && faxina.clt_id  !== req.user.id) return res.status(403).json({ error: 'Acesso negado.' });
      if (req.user.role === 'USER' && faxina.user_id !== req.user.id) return res.status(403).json({ error: 'Acesso negado.' });

      return res.json({ faxina });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar faxina.' });
    }
  }

  static async create(req, res) {
    try {
      const {
        cltId, addressId, scheduledDate, scheduledTime,
        durationHours = 3, propertyType = 'residencial',
        squareMeters, observations,
      } = req.body;

      // CLT disponivel?
      const cltProfile = await CltProfileModel.findByUserId(cltId);
      if (!cltProfile || cltProfile.status !== 'disponivel') {
        return res.status(400).json({ error: 'CLT não está disponível para agendamento.' });
      }

      // Conflito de horario do CLT (considera duracao)
      const cltConflict = await FaxinaModel.checkCltConflict(
        cltId, scheduledDate, scheduledTime, durationHours
      );
      if (cltConflict) {
        return res.status(409).json({
          error: 'Este profissional já possui uma faxina nesse intervalo de horário.',
        });
      }

      // Conflito de horario do USER (considera duracao)
      const userConflict = await FaxinaModel.checkUserConflict(
        req.user.id, scheduledDate, scheduledTime, durationHours
      );
      if (userConflict) {
        return res.status(409).json({
          error: 'Você já possui uma faxina agendada nesse intervalo de horário.',
        });
      }

      const faxina = await FaxinaModel.create({
        userId: req.user.id, cltId, addressId,
        scheduledDate, scheduledTime, durationHours,
        propertyType, squareMeters, observations, price: null,
      });

      return res.status(201).json({ message: 'Faxina agendada com sucesso!', faxina });
    } catch (error) {
      console.error('FaxinaController.create:', error);
      return res.status(500).json({ error: 'Erro ao agendar faxina.' });
    }
  }

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

  static async cltUpdate(req, res) {
    try {
      const faxina = await FaxinaModel.findById(req.params.id);
      if (!faxina) return res.status(404).json({ error: 'Faxina não encontrada.' });
      if (faxina.clt_id !== req.user.id) return res.status(403).json({ error: 'Você só pode editar suas próprias faxinas.' });

      const { status, observations } = req.body;
      const updated = await FaxinaModel.update(req.params.id, { status, observations });
      return res.json({ message: 'Faxina atualizada.', faxina: updated });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar faxina.' });
    }
  }

  static async cancel(req, res) {
    try {
      const faxina = await FaxinaModel.findById(req.params.id);
      if (!faxina)                          return res.status(404).json({ error: 'Faxina não encontrada.' });
      if (faxina.user_id !== req.user.id)   return res.status(403).json({ error: 'Você só pode cancelar suas próprias faxinas.' });
      if (faxina.status  !== 'agendada')    return res.status(400).json({ error: 'Apenas faxinas agendadas podem ser canceladas.' });

      // Verifica a regra das 24h direto no banco (sem bug de timezone)
      const ok = await FaxinaModel.canCancel(faxina.id);
      if (!ok) {
        return res.status(400).json({
          error: 'Não é possível cancelar faxinas com menos de 24 horas de antecedência.',
        });
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