const events = [
  {
    id: "e1",
    title: "Oficina de Python para Iniciantes",
    description: "Introdução à lógica de programação com Python. Conceitos básicos e exercícios práticos.",
    date: "2025-11-12",
    time: "14:00",
    location: "Laboratório 3 - UTFPR",
    status: "published",
    type: "Oficina",
    vacancies: "30 vagas" 
  },
  {
    id: "e2",
    title: "Minicurso: Design de Interfaces",
    description: "Princípios de design, acessibilidade e criação de protótipos simples.",
    date: "2025-11-20",
    time: "09:00",
    location: "Auditório Central",
    status: "draft",
    type: "Minicurso",
    vacancies: "20 vagas"
  },
  {
    id: "e3",
    title: "Roda de Conversa: Carreiras em TI",
    description: "Profissionais contam suas trajetórias e respondem perguntas das participantes.",
    date: "2025-12-03",
    time: "18:00",
    location: "Sala 12 - Bloco B",
    status: "published",
    type: "Roda de Conversa",
    vacancies: "Ilimitado"
  },
  {
    id: "e4",
    title: "Oficina de Robótica Básica",
    description: "Montagem e programação de pequenos robôs com kits educacionais.",
    date: "2025-12-10",
    time: "13:00",
    location: "Laboratório de Robótica",
    status: "published",
    type: "Oficina",
    vacancies: "25 vagas" 
  }
];

// Query elements
const eventsGrid = document.getElementById('eventsGrid');
const noEvents = document.getElementById('noEvents');
const eventsCountEl = document.getElementById('eventsCount');
const verEventosBtn = document.getElementById('verEventosBtn');
const sobreBtn = document.getElementById('sobreBtn');
const loginBtn = document.getElementById('loginBtn');

// Scroll handlers
verEventosBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' });
});
sobreBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  // If you had an about section, scroll or open a modal. For now, show an alert.
  window.alert("Sobre o projeto: Meninas Digitais - UTFPR-CP. Ferramenta para gestão de oficinas e minicursos.");
});
loginBtn?.addEventListener('click', () => {
  window.alert("Tela de login (a implementar).");
});

// render function
function formatDate(dateStr){
  try{
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  }catch(e){ return dateStr; }
}

function createEventCard(event){
  const card = document.createElement('article');
  card.className = 'event-card';
  card.setAttribute('data-id', event.id);

  const cover = document.createElement('div');
  cover.className = 'cover event-badges-container';

  const typeBadge = document.createElement('span');
  typeBadge.className = 'badge badge-type';
  typeBadge.textContent = event.type;

  const vacanciesBadge = document.createElement('span');
  vacanciesBadge.className = 'badge badge-vacancies';
  vacanciesBadge.textContent = event.vacancies;
  
  cover.appendChild(typeBadge);
  cover.appendChild(vacanciesBadge);

  const content = document.createElement('div');
  content.className = 'content';

  const title = document.createElement('h3');
  title.textContent = event.title;

  const dateTime = document.createElement('p');
  dateTime.className = 'event-meta-line';
  dateTime.innerHTML = `<span class="icon-text">🗓️ ${formatDate(event.date)}</span> <span class="icon-text">🕒 ${event.time}</span>`;

  const locationEl = document.createElement('p');
  locationEl.className = 'event-meta-line';
  locationEl.innerHTML = `<span class="icon-text">📍 ${event.location}</span>`;


  const desc = document.createElement('p');
  desc.className = 'event-desc';
  desc.textContent = event.description;

  const actions = document.createElement('div');
  actions.className = 'card-actions';

  const btnUnified = document.createElement('button');
  btnUnified.className = 'btn btn-join';
  btnUnified.type = 'button';
  btnUnified.textContent = 'Ver Detalhes e Inscrever-se';
  
  btnUnified.addEventListener('click', () => {
    window.alert(`${event.title} (${event.type})\n\n${event.description}\n\nData: ${formatDate(event.date)} às ${event.time}\nLocal: ${event.location}\nVagas: ${event.vacancies}\n\n(Simulando a navegação para a página de detalhes/inscrição)`);
  });
  
  actions.appendChild(btnUnified);

  content.appendChild(title);
  content.appendChild(dateTime); 
  content.appendChild(locationEl); 
  content.appendChild(desc);
  content.appendChild(actions);

  card.appendChild(cover);
  card.appendChild(content);

  return card;
}

function renderEvents(){
  // Filter published events
  const published = events.filter(e => e.status === 'published');

  // update stats number
  eventsCountEl.textContent = `${published.length}+`;

  // toggle empty state
  if(published.length === 0){
    noEvents.hidden = false;
    eventsGrid.innerHTML = '';
    return;
  } else {
    noEvents.hidden = true;
  }

  eventsGrid.innerHTML = '';
  published.forEach(ev => {
    const card = createEventCard(ev);
    eventsGrid.appendChild(card);
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderEvents();
});