const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    senha: {
      type: String,
      required: true,
    },
    perfil: {
      type: String,
      required: true,
      enum: ["administradora", "aluna"],
      default: "aluna",
    },
    // Futuramente, podemos adicionar outros campos como:
    // instituicao_ensino: String,
    // serie: String,
    eventos_inscritos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Evento",
      },
    ],
  },
  {
    timestamps: true, // Adiciona os campos createdAt e updatedAt automaticamente
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
