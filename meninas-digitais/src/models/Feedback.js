const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Schema para armazenar o feedback detalhado de uma aluna sobre um evento.
 */
const feedbackSchema = new Schema(
  {
    aluna: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    evento: {
      type: Schema.Types.ObjectId,
      ref: "Evento",
      required: true,
    },
    satisfacao_organizacao: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "A satisfação com a organização é obrigatória."],
    },
    satisfacao_conteudo: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "A satisfação com o conteúdo é obrigatória."],
    },
    satisfacao_carga_horaria: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "A satisfação com a carga horária é obrigatória."],
    },
    pontos_positivos: {
      type: String,
      trim: true,
    },
    pontos_negativos: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

feedbackSchema.index({ aluna: 1, evento: 1 }, { unique: true });

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
