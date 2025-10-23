const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventoSchema = new Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true,
    },
    descricao: {
      type: String,
      required: true,
    },
    data: {
      type: Date,
      required: true,
    },
    horario: {
      type: String,
      required: true,
    },
    local: {
      type: String, // Pode ser um endereço ou um link para evento online
      required: true,
    },
    publico_alvo: {
      type: String,
    },
    numero_vagas: {
      type: Number,
      required: true,
      min: 0,
    },
    participantes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Evento = mongoose.model("Evento", eventoSchema);

module.exports = Evento;
