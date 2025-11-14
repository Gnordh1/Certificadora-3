const User = require("../models/User");
const Evento = require("../models/Event");

/**
 * @desc    Busca dados agregados para o dashboard do admin.
 * @route   GET /api/stats/dashboard
 * @access  Privado/Admin
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const [totalAlunas, totalEventos, totalInscricoes] = await Promise.all([
      User.countDocuments({ perfil: "aluna" }),
      Evento.countDocuments(),
      // Usamos a pipeline de agregação do MongoDB para somar o número de inscritos
      Evento.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: { $size: "$participantes" } }, // Soma o tamanho do array 'participantes'
          },
        },
      ]),
    ]);

    res.json({
      totalAlunas,
      totalEventos,
      totalInscricoes:
        totalInscricoes.length > 0 ? totalInscricoes[0].total : 0,
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas do dashboard:", error);
    res.status(500).send("Erro no Servidor");
  }
};
