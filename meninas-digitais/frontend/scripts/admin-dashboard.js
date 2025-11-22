document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  if (!token) return;

  const dom = {
    alunas: document.getElementById("totalAlunas"),
    eventos: document.getElementById("totalEventos"),
    inscricoes: document.getElementById("totalInscricoes"),
  };

  try {
    const res = await fetch("/api/stats/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Erro ao carregar dados");

    const data = await res.json();

    dom.alunas.textContent = data.totalAlunas || 0;
    dom.eventos.textContent = data.totalEventos || 0;
    dom.inscricoes.textContent = data.totalInscricoes || 0;
  } catch (error) {
    console.error(error);
    dom.alunas.textContent = "-";
    dom.eventos.textContent = "-";
    dom.inscricoes.textContent = "-";
  }
});
