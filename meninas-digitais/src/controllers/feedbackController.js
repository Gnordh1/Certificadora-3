const Feedback = require("../models/Feedback");
const Evento = require("../models/Event");

/**
 * @desc    Permite que uma aluna logada submeta um feedback para um evento.
 * @route   POST /api/feedbacks
 * @access  Privado/Aluna
 */
exports.submitFeedback = async (req, res) => {
  const {
    eventoId,
    satisfacao_organizacao,
    satisfacao_conteudo,
    satisfacao_carga_horaria,
    pontos_positivos,
    pontos_negativos,
  } = req.body;
  const alunaId = req.user.id;

  try {
    const evento = await Evento.findById(eventoId);
    if (!evento) {
      return res.status(404).json({ msg: "Evento não encontrado." });
    }

    if (evento.status !== "Concluído") {
      return res.status(403).json({
        msg: "Feedbacks só podem ser enviados para eventos que já foram concluídos.",
      });
    }

    const isEnrolled = evento.participantes.some(
      (participanteId) => participanteId.toString() === alunaId
    );
    if (!isEnrolled) {
      return res.status(403).json({
        msg: "Você não pode avaliar um evento no qual não se inscreveu.",
      });
    }

    const newFeedback = new Feedback({
      aluna: alunaId,
      evento: eventoId,
      satisfacao_organizacao,
      satisfacao_conteudo,
      satisfacao_carga_horaria,
      pontos_positivos,
      pontos_negativos,
    });

    await newFeedback.save();

    res
      .status(201)
      .json({ msg: "Feedback enviado com sucesso!", feedback: newFeedback });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ msg: "Você já enviou um feedback para este evento." });
    }
    // Adiciona tratamento para erros de validação do Mongoose
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ msg: messages.join(" ") });
    }
    console.error(error.message);
    res.status(500).send("Erro no Servidor");
  }
};

/**
 * @desc    Busca todos os feedbacks de um evento específico.
 * @route   GET /api/feedbacks/evento/:eventId
 * @access  Privado/Admin
 */
exports.getEventFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ evento: req.params.eventId })
      .populate("aluna", "nome email") // Popula com nome e email da aluna
      .sort({ createdAt: -1 }); // Mais recentes primeiro

    if (!feedbacks) {
      return res
        .status(404)
        .json({ msg: "Nenhum feedback encontrado para este evento." });
    }

    res.json(feedbacks);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Erro no Servidor");
  }
};
