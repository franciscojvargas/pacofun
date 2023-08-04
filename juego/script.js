let words = ['prueba1', 'prueba2', 'prueba3', 'prueba4', 'prueba5'];
let wordsCopy = words.slice();
let redTeam = [];
let blueTeam = [];
let currentPlayerIndex = 0;
let round1Score = { red: 0, blue: 0 };
let round2Score = { red: 0, blue: 0 };
let round3Score = { red: 0, blue: 0 };
let currentRound = 1;
let wordElement;
let count = 30;

const loadWords = async () => {
  try {
    const response = await fetch('palabras.txt');
    const fileContent = await response.text();
    const allWords = fileContent.split('\n').map(word => word.trim());

    // Obtener 35 palabras aleatorias
    const randomIndices = [];
    while (randomIndices.length < 35) {
      const randomIndex = Math.floor(Math.random() * allWords.length);
      if (!randomIndices.includes(randomIndex)) {
        randomIndices.push(randomIndex);
      }
    }

    words = randomIndices.map(index => allWords[index]);
    wordsCopy = [...words];
    console.log(wordsCopy);
  } catch (err) {
    Swal.fire({
      text: 'No se han podido cargar las palabras.',
      icon: 'error',
      confirmButtonText: 'Aceptar',
    });
  }
};

loadWords();

/**
 * addPlayer: Función que se ejecuta cuando se presiona el botón "Añadir jugador"
 */
const addPlayer = () => {
  const playerInput = document.getElementById("player-input");
  const playerName = playerInput.value.trim();

  if (playerName !== "") {
    const playerElement = document.createElement("li");
    playerElement.className = "list-group-item";
    playerElement.textContent = playerName;

    const redPlayers = document.getElementById("red-players");
    const bluePlayers = document.getElementById("blue-players");

    if (redPlayers.children.length <= bluePlayers.children.length) {
      redPlayers.appendChild(playerElement);
    } else {
      bluePlayers.appendChild(playerElement);
    }

    playerInput.value = "";
  }
};

/**
 * randomizeTeams: mezcla los jugadores y los asigna a los equipos.
 * Se ejecuta cuando se presiona el botón "Mezclar equipos".
 */
const randomizeTeams = () => {  
  const redPlayers = Array.from(document.getElementById("red-players").children);
  const bluePlayers = Array.from(document.getElementById("blue-players").children);
  const allPlayers = [...redPlayers, ...bluePlayers];

  // Ordenar aleatoriamente los jugadores
  allPlayers.sort(() => 0.5 - Math.random());

  // Limpiar los equipos existentes
  document.getElementById("red-players").innerHTML = "";
  document.getElementById("blue-players").innerHTML = "";

  // Distribuir jugadores en los equipos
  allPlayers.forEach((playerElement, index) => {
    if (index % 2 === 0) {
      document.getElementById("red-players").appendChild(playerElement);
    } else {
      document.getElementById("blue-players").appendChild(playerElement);
    }
  });
};

/**
 * saveTeams: guarda los equipos en las variables globales redTeam y blueTeam.
 * Se ejecuta cuando se presiona el botón "Comenzar juego".
 */
const saveTeams = () => {
  const redPlayers = Array.from(document.getElementById("red-players").children);
  const bluePlayers = Array.from(document.getElementById("blue-players").children);

  redTeam = redPlayers.map((playerElement) => playerElement.textContent.trim());
  blueTeam = bluePlayers.map((playerElement) => playerElement.textContent.trim());
  
  if (redTeam.length > 0 && blueTeam.length > 0) {
    nextPlayer();
    console.log(`Equipo rojo: ${redTeam}`);
    console.log(`Equipo azul: ${blueTeam}`);
  } else {
    Swal.fire({
      text: 'Debes añadir al menos un jugador a cada equipo',
      icon: 'warning',
      confirmButtonText: 'Aceptar',
    });
  }
};

/**
 * clearScreen: limpia la pantalla
 */
const clearScreen = () => {
  const elements = document.querySelectorAll("body *");

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (!element.classList.contains("playerTime")) {
      element.parentNode.removeChild(element);
    }
  }
};

/**
 * contador: muestra un contador en pantalla y ejecuta la función startGame cuando termina.
 */
const contador = () => {
  clearScreen();

  const countdownElement = document.createElement("div");
  countdownElement.className = "countdown";
  document.body.appendChild(countdownElement);

  let count = 3;
  countdownElement.textContent = count;

  const countdownInterval = setInterval(() => {
    count--;
    countdownElement.textContent = count;

    if (count <= 0) {
      clearInterval(countdownInterval);
      document.body.removeChild(countdownElement);

      // Mostrar palabra y empezar a contar
      nextWord();
      startNewCountdown();
    }
  }, 1000);
};

const startNewCountdown = () => {
  count = 30;
  const countdownElement = document.createElement("div");
  countdownElement.className = "countdown playerTime";
  countdownElement.textContent = count;
  document.body.appendChild(countdownElement);

  if (words.length <= 0) {
    showResults();
  }

  const countdownInterval = setInterval(() => {
    if (words.length <= 0) {
      showResults();
      document.body.removeChild(countdownElement);
      clearInterval(countdownInterval);
      return;
    }

    count--;
    countdownElement.textContent = count;

    if (count <= 0) {
      clearInterval(countdownInterval);
      nextPlayerTurn();
    }
  }, 1000);
};

/**
 * nextPlayer: muestra en pantalla a un jugador y un botón para comenzar el juego.
 * Se ejecuta cuando se presiona el botón "Comenzar juego".
 */
const nextPlayer = () => {
  let currentPlayer;
  let currentTeamColor;
  if (currentPlayerIndex % 2 === 0) {
    currentPlayer = redTeam[currentPlayerIndex / 2];
    currentTeamColor = "red";
  } else {
    currentPlayer = blueTeam[Math.floor(currentPlayerIndex / 2)];
    currentTeamColor = "blue";
  }

  clearScreen();

  const container = document.createElement("div");
  container.classList.add("container");
  document.body.appendChild(container);

  const playerNameElement = document.createElement("h2");
  playerNameElement.textContent = currentPlayer;
  playerNameElement.classList.add("player-name", currentTeamColor);
  container.appendChild(playerNameElement);

  const wordsRemainingElement = document.createElement("div");
  wordsRemainingElement.textContent = `Palabras restantes: ${words.length}`;
  wordsRemainingElement.classList.add("words-remaining");
  container.appendChild(wordsRemainingElement);

  const startButton = document.createElement("button");
  startButton.textContent = "Empezar";
  startButton.classList.add("btn", "btn-primary");
  startButton.addEventListener("click", () => {
    contador();
  });
  container.appendChild(startButton);
};

const nextWord = () => {
  clearScreen();

  if (words.length === 0) {
    showResults();
    return;
  }

  const container = document.createElement("div");
  container.classList.add("container");
  document.body.appendChild(container);

  wordElement = document.createElement("h1");
  const randomWord = getRandomWord();
  wordElement.textContent = randomWord;
  wordElement.classList.add("word");
  container.appendChild(wordElement);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("row", "justify-content-center", "mt-4");
  container.appendChild(buttonContainer);

  const incorrectButton = document.createElement("button");
  incorrectButton.textContent = "Incorrecto";
  incorrectButton.classList.add("btn", "btn-danger", "col-4", "me-2");
  incorrectButton.addEventListener("click", () => {
    handleAnswer(false);
    let wrong = new Audio(`../sounds/wrong${Math.floor(Math.random() * 3) + 1}.mp3`);
    wrong.play();
  });
  buttonContainer.appendChild(incorrectButton);

  const correctButton = document.createElement("button");
  correctButton.textContent = "Correcto";
  correctButton.classList.add("btn", "btn-success", "col-4", "ms-2");
  correctButton.addEventListener("click", () => {
    handleAnswer(true);
    let correct = new Audio('../sounds/correct.mp3');
    correct.play();
  });
  buttonContainer.appendChild(correctButton);

  const wordsRemainingElement = document.createElement("div");
  wordsRemainingElement.textContent = `Palabras restantes: ${words.length}`;
  wordsRemainingElement.classList.add("words-remaining", "text-center", "mt-4");
  container.appendChild(wordsRemainingElement);
};


const getRandomWord = () => {
  const randomIndex = Math.floor(Math.random() * words.length);
  const word = words[randomIndex];
  return word;
};

const handleAnswer = (isCorrect) => {
  if (isCorrect) {
    // Sumar un punto al equipo del jugador actual
    if (currentPlayerIndex % 2 === 0) {
      if (currentRound === 1) {
        round1Score.red++;
      } else if (currentRound === 2) {
        round2Score.red++;
      } else if (currentRound === 3) {
        round3Score.red++;
      }
    } else {
      if (currentRound === 1) {
        round1Score.blue++;
      } else if (currentRound === 2) {
        round2Score.blue++;
      } else if (currentRound === 3) {
        round3Score.blue++;
      }
    }

    // Eliminar la palabra del array de palabras
    const wordIndex = words.indexOf(wordElement.textContent);
    if (wordIndex !== -1) {
      words.splice(wordIndex, 1);
    }

    nextWord();
  } else {
    // Si es incorrecto, restar 4 segundos al contador y mostrar la siguiente palabra
    count -= 4;
    nextWord();
  }
};

const nextPlayerTurn = () => {
  document.body.removeChild(document.getElementsByClassName("playerTime")[0]);

  const redPlayers = redTeam.length;
  const bluePlayers = blueTeam.length;
  const totalPlayers = redPlayers + bluePlayers;

  currentPlayerIndex++;

  if (currentPlayerIndex >= totalPlayers) {
    currentPlayerIndex = 0; // Volver al primer jugador
    words = words.slice(0, words.length); // Restaurar las palabras restantes
  }

  const currentTeam = currentPlayerIndex % 2 === 0 ? redTeam : blueTeam;
  const currentPlayerIndexInTeam = Math.floor(currentPlayerIndex / 2);
  const currentPlayer = currentTeam[currentPlayerIndexInTeam];
  const currentPlayerTeam = currentPlayerIndex % 2 === 0 ? "rojo" : "azul";
  console.log(`Turno del jugador ${currentPlayer} del equipo ${currentPlayerTeam}`);

  nextPlayer();
};

/**
 * newRound: Empieza una nueva ronda con nueva puntuación
 */
const newRound = () => {
  clearScreen();

  currentRound++;

  words = wordsCopy.slice();

  const container = document.createElement("div");
  container.classList.add("container");
  document.body.appendChild(container);

  const roundNumberElement = document.createElement("h2");
  roundNumberElement.textContent = `Ronda ${currentRound}`;
  roundNumberElement.classList.add("round-number");
  container.appendChild(roundNumberElement);

  const continueButton = document.createElement("button");
  continueButton.textContent = "Continuar";
  continueButton.classList.add("btn", "btn-primary");
  continueButton.addEventListener("click", () => {
    if (currentRound > 3) {
      showResults();
    } else {
      nextPlayer();
    }
  });
  container.appendChild(continueButton);
};

/**
 * showResults: muestra la pantalla final con la puntuación de cada equipo.
 */
const showResults = () => {
  clearScreen();

  const container = document.createElement("div");
  container.classList.add("container");
  document.body.appendChild(container);

  const mainContent = document.createElement("div");
  mainContent.classList.add("d-flex", "flex-column", "align-items-center");
  container.appendChild(mainContent);

  const table = document.createElement("table");
  table.classList.add("score-table");
  mainContent.appendChild(table);

  const headerRow = document.createElement("tr");
  table.appendChild(headerRow);

  const headerCell = document.createElement("th");
  headerCell.textContent = "";
  headerRow.appendChild(headerCell);

  const redHeaderCell = document.createElement("th");
  redHeaderCell.textContent = "Equipo Rojo";
  redHeaderCell.classList.add("red");
  headerRow.appendChild(redHeaderCell);

  const blueHeaderCell = document.createElement("th");
  blueHeaderCell.textContent = "Equipo Azul";
  blueHeaderCell.classList.add("blue");
  headerRow.appendChild(blueHeaderCell);

  for (let i = 0; i < currentRound; i++) {
    const roundRow = document.createElement("tr");
    table.appendChild(roundRow);

    const roundCell = document.createElement("td");
    roundCell.textContent = `Ronda ${i + 1}`;
    roundRow.appendChild(roundCell);

    const redScoreCell = document.createElement("td");
    redScoreCell.textContent =
      i === 0 ? round1Score.red : i === 1 ? round2Score.red : round3Score.red;
    redScoreCell.classList.add("red");
    roundRow.appendChild(redScoreCell);

    const blueScoreCell = document.createElement("td");
    blueScoreCell.textContent =
      i === 0 ? round1Score.blue : i === 1 ? round2Score.blue : round3Score.blue;
    blueScoreCell.classList.add("blue");
    roundRow.appendChild(blueScoreCell);
  }

  const separator = document.createElement("div");
  separator.classList.add("my-3");
  mainContent.appendChild(separator);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("d-flex", "justify-content-center");
  mainContent.appendChild(buttonContainer);

  const continueButton = document.createElement("button");
  continueButton.textContent = currentRound === 3 ? "Resultados finales" : "Continuar";
  continueButton.classList.add("btn", "btn-primary");
  continueButton.addEventListener("click", () => {
    if (currentRound === 3) {
      clearScreen();
      showFinalResults();
    } else {
      newRound();
    }
  });
  buttonContainer.appendChild(continueButton);
};

/**
 * showFinalResults: muestra los resultados finales del juego.
 */
const showFinalResults = () => {
  clearScreen();

  const container = document.createElement("div");
  container.classList.add("container");
  document.body.appendChild(container);

  const mainContent = document.createElement("div");
  mainContent.classList.add("d-flex", "flex-column", "align-items-center");
  container.appendChild(mainContent);

  const finalScoresHeader = document.createElement("h2");
  finalScoresHeader.textContent = "Resultados Finales";
  mainContent.appendChild(finalScoresHeader);

  const table = document.createElement("table");
  table.classList.add("score-table");
  mainContent.appendChild(table);

  const headerRow = document.createElement("tr");
  table.appendChild(headerRow);

  const headerCell = document.createElement("th");
  headerCell.textContent = "";
  headerRow.appendChild(headerCell);

  const redHeaderCell = document.createElement("th");
  redHeaderCell.textContent = "Equipo Rojo";
  redHeaderCell.classList.add("red");
  headerRow.appendChild(redHeaderCell);

  const blueHeaderCell = document.createElement("th");
  blueHeaderCell.textContent = "Equipo Azul";
  blueHeaderCell.classList.add("blue");
  headerRow.appendChild(blueHeaderCell);

  for (let i = 0; i < 3; i++) {
    const roundRow = document.createElement("tr");
    table.appendChild(roundRow);

    const roundCell = document.createElement("td");
    roundCell.textContent = `Ronda ${i + 1}`;
    roundRow.appendChild(roundCell);

    const redScoreCell = document.createElement("td");
    redScoreCell.textContent =
      i === 0 ? round1Score.red : i === 1 ? round2Score.red : round3Score.red;
    redScoreCell.classList.add("red");
    roundRow.appendChild(redScoreCell);

    const blueScoreCell = document.createElement("td");
    blueScoreCell.textContent =
      i === 0 ? round1Score.blue : i === 1 ? round2Score.blue : round3Score.blue;
    blueScoreCell.classList.add("blue");
    roundRow.appendChild(blueScoreCell);
  }

  const totalRedScore = round1Score.red + round2Score.red + round3Score.red;
  const totalBlueScore = round1Score.blue + round2Score.blue + round3Score.blue;

  const totalRow = document.createElement("tr");
  table.appendChild(totalRow);

  const totalCell = document.createElement("td");
  totalCell.textContent = "TOTAL";
  totalRow.appendChild(totalCell);

  const totalRedScoreCell = document.createElement("td");
  totalRedScoreCell.textContent = totalRedScore;
  totalRedScoreCell.classList.add("red");
  totalRow.appendChild(totalRedScoreCell);

  const totalBlueScoreCell = document.createElement("td");
  totalBlueScoreCell.textContent = totalBlueScore;
  totalBlueScoreCell.classList.add("blue");
  totalRow.appendChild(totalBlueScoreCell);

  const separator = document.createElement("div");
  separator.classList.add("my-3");
  mainContent.appendChild(separator);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("d-flex", "justify-content-center");
  mainContent.appendChild(buttonContainer);

  const restartButton = document.createElement("button");
  restartButton.textContent = "Volver a empezar";
  restartButton.classList.add("btn", "btn-primary");
  restartButton.addEventListener("click", () => {
    window.location.href = "../index.html";
  });
  buttonContainer.appendChild(restartButton);
};