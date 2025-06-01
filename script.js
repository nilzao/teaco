const TARGET = '★';
const DISTRACTORS = ['▲', '●', '■', '◆'];
const GRID_COLUMNS = 25;
const GRID_ROWS = 20;
const GRID_SIZE = GRID_COLUMNS * GRID_ROWS; // 500
const TARGET_COUNT = 180;
const testDuration = 240; // segundos

let startTime, correct = 0, incorrect = 0, clicked = 0;
let results = [];
let volunteerName = '';

function startTest() {
  const nameInput = document.getElementById('volunteerName').value.trim();

  if (!nameInput) {
    alert('Por favor, digite seu nome antes de iniciar o teste.');
    return;
  }

  volunteerName = nameInput;
  document.getElementById('instructions').classList.add('hidden');
  document.getElementById('test-area').classList.remove('hidden');
  correct = incorrect = clicked = 0;
  generateGrid();
  startTime = new Date();

  setTimeout(() => {
    if (correct < TARGET_COUNT) endTest();
  }, testDuration * 1000);
}

function generateGrid() {
  const area = document.getElementById('test-area');
  area.innerHTML = '';
  area.style.gridTemplateColumns = `repeat(${GRID_COLUMNS}, 30px)`;

  let figures = [];

  for (let i = 0; i < TARGET_COUNT; i++) figures.push(TARGET);
  while (figures.length < GRID_SIZE) {
    figures.push(DISTRACTORS[Math.floor(Math.random() * DISTRACTORS.length)]);
  }

  figures = figures.sort(() => Math.random() - 0.5);

  figures.forEach(symbol => {
    const div = document.createElement('div');
    div.className = 'figure';
    div.textContent = symbol;
    div.onclick = () => handleClick(div, symbol);
    area.appendChild(div);
  });
}

function handleClick(element, symbol) {
  if (element.classList.contains('clicked')) return;

  element.classList.add('clicked');
  clicked++;
  if (symbol === TARGET) {
    correct++;
    if (correct === TARGET_COUNT) {
      endTest();
    }
  } else {
    incorrect++;
  }
}

function endTest() {
  const duration = ((new Date()) - startTime) / 1000;
  const summary = `Nome: ${volunteerName} | Tempo: ${duration.toFixed(2)}s | Acertos: ${correct} | Erros: ${incorrect}`;
  document.getElementById('summary').textContent = summary;
  document.getElementById('test-area').classList.add('hidden');
  document.getElementById('results').classList.remove('hidden');

  results.push({
    nome: volunteerName,
    tempo: duration.toFixed(2),
    acertos: correct,
    erros: incorrect,
    cliques: clicked
  });
}

function downloadCSV() {
  const header = "Nome,Tempo,Acertos,Erros,Cliques\n";
  const rows = results.map(r => `${r.nome},${r.tempo},${r.acertos},${r.erros},${r.cliques}`).join("\n");
  const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });

  const sanitized = volunteerName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
  const filename = `resultado_${sanitized}.csv`;

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

