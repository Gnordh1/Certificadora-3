const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc    Obter os eventos em que o usuário logado está inscrito
// @route   GET /api/users/my-events
// @access  Privado/Aluna
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-senha"); // Exclui a senha
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Erro no servidor");
  }
};

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

// @desc    Atualizar perfil (Nome, Email, Senha)
// @route   PUT /api/users/me
// @access  Privado
exports.updateUserProfile = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }

    // 1. Atualiza Nome
    if (nome) user.nome = nome;

    // 2. Atualiza Email (com verificação de duplicidade)
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      // Se existe alguém com esse email E não sou eu mesmo
      if (emailExists && emailExists._id.toString() !== user._id.toString()) {
        return res.status(400).json({ msg: "Este e-mail já está em uso." });
      }
      user.email = email;
    }

    // 3. Atualiza Senha
    if (senha) {
      const salt = await bcrypt.genSalt(10);
      user.senha = await bcrypt.hash(senha, salt);
    }

    const updatedUser = await user.save();

    // 4. GERA UM NOVO TOKEN COM OS DADOS ATUALIZADOS
    // Isso é crucial para não precisar fazer login novamente
    const payload = {
      user: {
        id: updatedUser.id,
        perfil: updatedUser.perfil,
        nome: updatedUser.nome,
        email: updatedUser.email,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5h" },
      (err, token) => {
        if (err) throw err;
        // Retorna o usuário atualizado E o novo token
        res.json({
          user: {
            id: updatedUser._id,
            nome: updatedUser.nome,
            email: updatedUser.email,
            perfil: updatedUser.perfil,
          },
          token,
        });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Erro no Servidor ao atualizar perfil");
  }
};
