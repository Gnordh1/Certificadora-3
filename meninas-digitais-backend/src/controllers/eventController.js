const Evento = require("../models/Event");
const User = require("../models/User");

// @desc    Criar um novo evento
// @route   POST /api/eventos
// @access  Privado/Admin
exports.createEvento = async (req, res) => {
  const { titulo, descricao, data, horario, local, numero_vagas } = req.body;

  try {
    const novoEvento = new Evento({
      titulo,
      descricao,
      data,
      horario,
      local,
      numero_vagas,
    });

    const eventoSalvo = await novoEvento.save();
    res.status(201).json(eventoSalvo);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Erro no Servidor");
  }
};

// @desc    Listar todos os eventos
// @route   GET /api/eventos
// @access  Público
exports.getAllEventos = async (req, res) => {
  try {
    const eventos = await Evento.find().sort({ data: -1 }); // Ordena pelos mais recentes
    res.json(eventos);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Erro no Servidor");
  }
};

// @desc    Obter um evento por ID
// @route   GET /api/eventos/:id
// @access  Público
exports.getEventoById = async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id);

    if (!evento) {
      return res.status(404).json({ msg: "Evento não encontrado" });
    }

    res.json(evento);
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Evento não encontrado" });
    }
    res.status(500).send("Erro no Servidor");
  }
};

// @desc    Atualizar um evento
// @route   PUT /api/eventos/:id
// @access  Privado/Admin
exports.updateEvento = async (req, res) => {
  try {
    let evento = await Evento.findById(req.params.id);

    if (!evento) {
      return res.status(404).json({ msg: "Evento não encontrado" });
    }

    evento = await Evento.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true } // Retorna o documento modificado
    );

    res.json(evento);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Erro no Servidor");
  }
};

// @desc    Deletar um evento
// @route   DELETE /api/eventos/:id
// @access  Privado/Admin
exports.deleteEvento = async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id);

    if (!evento) {
      return res.status(404).json({ msg: "Evento não encontrado" });
    }

    await Evento.findByIdAndDelete(req.params.id);

    res.json({ msg: "Evento removido com sucesso" });
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res
        .status(404)
        .json({ msg: "Evento não encontrado (ID mal formatado)" });
    }
    res.status(500).send("Erro no Servidor");
  }
};

// @desc    Inscrever usuário logado em um evento
// @route   POST /api/eventos/:id/enroll
// @access  Privado/Aluna
exports.enrollEvento = async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!evento) {
      return res.status(404).json({ msg: "Evento não encontrado" });
    }

    // 1. Verifica se ainda há vagas
    if (evento.participantes.length >= evento.numero_vagas) {
      return res
        .status(400)
        .json({ msg: "Não há mais vagas para este evento" });
    }

    // 2. Verifica se o usuário já está inscrito
    if (evento.participantes.includes(req.user.id)) {
      return res
        .status(400)
        .json({ msg: "Você já está inscrito(a) neste evento" });
    }

    // Inscreve o usuário
    evento.participantes.push(req.user.id);
    user.eventos_inscritos.push(evento.id);

    await evento.save();
    await user.save();

    res.json({ msg: "Inscrição realizada com sucesso!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Erro no Servidor");
  }
};

// @desc    Cancelar inscrição de um usuário em um evento
// @route   POST /api/eventos/:id/unenroll
// @access  Privado/Aluna
exports.unenrollEvento = async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!evento) {
      return res.status(404).json({ msg: "Evento não encontrado" });
    }

    // Verifica se o usuário realmente está inscrito
    if (!evento.participantes.includes(req.user.id)) {
      return res
        .status(400)
        .json({ msg: "Você não está inscrito(a) neste evento" });
    }

    // Remove a inscrição usando o operador $pull do MongoDB
    await Evento.updateOne(
      { _id: evento.id },
      { $pull: { participantes: req.user.id } }
    );
    await User.updateOne(
      { _id: user.id },
      { $pull: { eventos_inscritos: evento.id } }
    );

    res.json({ msg: "Inscrição cancelada com sucesso." });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Erro no Servidor");
  }
};
