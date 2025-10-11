const User = require("../models/User");

// @desc    Obter os eventos em que o usuário logado está inscrito
// @route   GET /api/users/my-events
// @access  Privado/Aluna
exports.getMyEvents = async (req, res) => {
  try {
    // Encontra o usuário e popula o campo 'eventos_inscritos'
    // .populate() substitui os IDs dos eventos pelos documentos completos dos eventos
    const user = await User.findById(req.user.id).populate({
      path: "eventos_inscritos",
      options: { sort: { data: 1 } }, // Ordena os eventos pela data
    });

    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }

    res.json(user.eventos_inscritos);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Erro no Servidor");
  }
};
