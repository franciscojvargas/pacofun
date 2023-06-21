let words = ['prueba'];
let redTeam = [];
let blueTeam = [];
let currentPlayerIndex = 0;
let redScore = 0;
let blueScore = 0;
let wordElement;
let count = 30;

// Cargar palabras
const loadWords = async () => {
  try {
    const response = await fetch('palabras.txt');
    const fileContent = await response.text();
    const allWords = fileContent.split('\n').map(word => word.trim());
    
    // Obtener 40 palabras aleatorias
    const randomIndices = [];
    while (randomIndices.length < 40) {
      const randomIndex = Math.floor(Math.random() * allWords.length);
      if (!randomIndices.includes(randomIndex)) {
        randomIndices.push(randomIndex);
      }
    }
    
    words = randomIndices.map(index => allWords[index]);
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
  const countdownElement = document.createElement("div");
  countdownElement.className = "countdown playerTime";
  countdownElement.textContent = "30";
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




/*------------------------------------*/
/* Código para la pantalla de juego */
/*------------------------------------*/

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
  });
  buttonContainer.appendChild(incorrectButton);

  const correctButton = document.createElement("button");
  correctButton.textContent = "Correcto";
  correctButton.classList.add("btn", "btn-success", "col-4", "ms-2");
  correctButton.addEventListener("click", () => {
    handleAnswer(true);
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
      redScore++;
      console.log(`Puntuación equipo rojo: ${redScore}`);
    } else {
      blueScore++;
      console.log(`Puntuación equipo azul: ${blueScore}`);
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
  count = 30;
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
 * showResults: muestra la pantalla final con la puntuación de cada equipo.
 */
const showResults = () => {
  clearScreen();

  const container = document.createElement("div");
  container.classList.add("container");
  document.body.appendChild(container);

  const redScoreElement = document.createElement("h2");
  redScoreElement.textContent = `Equipo rojo: ${redScore}`;
  redScoreElement.classList.add("score", "red");
  container.appendChild(redScoreElement);

  const blueScoreElement = document.createElement("h2");
  blueScoreElement.textContent = `Equipo azul: ${blueScore}`;
  blueScoreElement.classList.add("score", "blue");
  container.appendChild(blueScoreElement);

  const restartButton = document.createElement("button");
  restartButton.textContent = "Volver a empezar";
  restartButton.classList.add("btn", "btn-primary");
  restartButton.addEventListener("click", () => {
    window.location.href = "../index.html";
  });
  container.appendChild(restartButton);
};