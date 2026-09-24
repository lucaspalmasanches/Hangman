import { useState, useEffect, useCallback, useMemo } from "react"

const CHALKBOARD = "#1E3B32"
const CHALKBOARD_DARK = "#152922"
const FRAME = "#6B4226"
const FRAME_DARK = "#4A2E19"
const CHALK = "#F4F1E6"
const CHALK_DIM = "rgba(244, 241, 230, 0.35)"
const CHALK_YELLOW = "#E8C468"
const CHALK_RED = "#E0736C"
const CHALK_GREEN = "#8FBF9F"

const WORD_BANKS = {
  easy: [
    { word: "CAT", hint: "Animal doméstico que mia" },
    { word: "DOG", hint: "O melhor amigo do homem" },
    { word: "SUN", hint: "Estrela que ilumina o dia" },
    { word: "BOOK", hint: "Você lê isso, página por página" },
    { word: "TREE", hint: "Tem raízes, tronco e folhas" },
    { word: "FISH", hint: "Vive na água e tem guelras" },
    { word: "BIRD", hint: "Voa e tem penas" },
    { word: "MILK", hint: "Bebida branca que vem da vaca" },
    { word: "RAIN", hint: "Cai do céu em dias nublados" },
    { word: "STAR", hint: "Brilha no céu à noite" },
    { word: "DOOR", hint: "Você abre para entrar em um cômodo" },
    { word: "CAKE", hint: "Doce típico de aniversário" },
    { word: "MOON", hint: "Satélite natural da Terra" },
    { word: "SHOE", hint: "Usado nos pés" },
    { word: "CHAIR", hint: "Móvel em que você se senta" },
    { word: "APPLE", hint: "Fruta vermelha ou verde, comum em ditados" },
    { word: "HOUSE", hint: "Lugar onde você mora" },
    { word: "WATER", hint: "Líquido essencial para a vida" },
    { word: "HAPPY", hint: "Sentimento de alegria" },
    { word: "TABLE", hint: "Móvel onde você faz as refeições" },
  ],
  medium: [
    { word: "KITCHEN", hint: "Cômodo onde se cozinha" },
    { word: "AIRPORT", hint: "Lugar de onde os aviões decolam" },
    { word: "HOLIDAY", hint: "Período de férias ou feriado" },
    { word: "HOSPITAL", hint: "Lugar onde se tratam doenças" },
    { word: "LIBRARY", hint: "Repleta de livros para emprestar" },
    { word: "WEATHER", hint: "Condição do tempo: chuva, sol, vento..." },
    { word: "COMPUTER", hint: "Você provavelmente está usando um agora" },
    { word: "SANDWICH", hint: "Comida feita entre duas fatias de pão" },
    { word: "BICYCLE", hint: "Veículo de duas rodas, movido a pedal" },
    { word: "ELEPHANT", hint: "Animal enorme com uma tromba" },
    { word: "UMBRELLA", hint: "Usado para se proteger da chuva" },
    { word: "BIRTHDAY", hint: "Dia em que você nasceu, comemorado todo ano" },
    { word: "MOUNTAIN", hint: "Elevação natural muito alta" },
    { word: "STADIUM", hint: "Onde acontecem jogos de futebol" },
    { word: "NEIGHBOR", hint: "Pessoa que mora ao lado" },
    { word: "SUITCASE", hint: "Usada para levar roupas em viagens" },
    { word: "CALENDAR", hint: "Mostra os dias, meses e o ano" },
    { word: "VACATION", hint: "Período de descanso das aulas ou trabalho" },
  ],
  hard: [
    { word: "KNOWLEDGE", hint: "Sabedoria ou informação adquirida" },
    { word: "ENVIRONMENT", hint: "Tudo que envolve e afeta os seres vivos" },
    { word: "REFRIGERATOR", hint: "Eletrodoméstico que mantém a comida gelada" },
    { word: "VOCABULARY", hint: "Conjunto de palavras que você conhece" },
    { word: "RESTAURANT", hint: "Lugar onde você paga para comer" },
    { word: "GOVERNMENT", hint: "Sistema que administra um país" },
    { word: "ARCHITECTURE", hint: "Arte de projetar edifícios" },
    { word: "PSYCHOLOGY", hint: "Estudo da mente e do comportamento" },
    { word: "TECHNOLOGY", hint: "Avanços e ferramentas modernas" },
    { word: "INTERNATIONAL", hint: "Relativo a mais de um país" },
    { word: "ENTREPRENEUR", hint: "Pessoa que cria e administra seu próprio negócio" },
    { word: "PRONUNCIATION", hint: "Forma correta de falar as palavras" },
    { word: "CELEBRATION", hint: "Comemoração de um evento especial" },
    { word: "IMAGINATION", hint: "Capacidade de criar ideias na mente" },
    { word: "RESPONSIBILITY", hint: "Obrigação de cuidar de algo ou alguém" },
  ],
}

const MAX_WRONG = 6

const DIFFICULTY_LABELS = {
  easy: "Fácil",
  medium: "Médio",
  hard: "Difícil",
}

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
]

function pickWord(difficulty) {
  const bank = WORD_BANKS[difficulty]
  return bank[Math.floor(Math.random() * bank.length)]
}

function HangmanFigure({ wrongCount }) {
  return (
    <svg viewBox="0 0 220 220" className="w-48 h-48 sm:w-56 sm:h-56">
      <line x1="20" y1="200" x2="120" y2="200" stroke={CHALK} strokeWidth="4" strokeLinecap="round" />
      <line x1="50" y1="200" x2="50" y2="20" stroke={CHALK} strokeWidth="4" strokeLinecap="round" />
      <line x1="50" y1="20" x2="150" y2="20" stroke={CHALK} strokeWidth="4" strokeLinecap="round" />
      <line x1="150" y1="20" x2="150" y2="45" stroke={CHALK} strokeWidth="4" strokeLinecap="round" />

      {wrongCount >= 1 && (
        <circle cx="150" cy="65" r="20" fill="none" stroke={CHALK} strokeWidth="4" />
      )}
      {wrongCount >= 2 && (
        <line x1="150" y1="85" x2="150" y2="140" stroke={CHALK} strokeWidth="4" strokeLinecap="round" />
      )}
      {wrongCount >= 3 && (
        <line x1="150" y1="100" x2="125" y2="120" stroke={CHALK} strokeWidth="4" strokeLinecap="round" />
      )}
      {wrongCount >= 4 && (
        <line x1="150" y1="100" x2="175" y2="120" stroke={CHALK} strokeWidth="4" strokeLinecap="round" />
      )}
      {wrongCount >= 5 && (
        <line x1="150" y1="140" x2="128" y2="175" stroke={CHALK} strokeWidth="4" strokeLinecap="round" />
      )}
      {wrongCount >= 6 && (
        <line x1="150" y1="140" x2="172" y2="175" stroke={CHALK} strokeWidth="4" strokeLinecap="round" />
      )}
    </svg>
  )
}

export default function App() {
  const [screen, setScreen] = useState("menu")
  const [difficulty, setDifficulty] = useState("easy")
  const [entry, setEntry] = useState(() => pickWord("easy"))
  const [guessed, setGuessed] = useState([])
  const [wrong, setWrong] = useState([])

  const word = entry.word
  const letters = useMemo(() => word.split(""), [word])
  const wrongCount = wrong.length
  const isWon = letters.every((letter) => guessed.includes(letter))
  const isLost = wrongCount >= MAX_WRONG

  const startGame = useCallback((diff) => {
    setDifficulty(diff)
    setEntry(pickWord(diff))
    setGuessed([])
    setWrong([])
    setScreen("playing")
  }, [])

  const guessLetter = useCallback(
    (letter) => {
      if (screen !== "playing" || isWon || isLost) return
      if (guessed.includes(letter) || wrong.includes(letter)) return

      if (letters.includes(letter)) {
        setGuessed((prev) => [...prev, letter])
      } else {
        setWrong((prev) => [...prev, letter])
      }
    },
    [screen, isWon, isLost, guessed, wrong, letters]
  )

  useEffect(() => {
    if (screen !== "playing") return
    const handleKeyDown = (e) => {
      const letter = e.key.toUpperCase()
      if (letter.length === 1 && letter >= "A" && letter <= "Z") {
        guessLetter(letter)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [screen, guessLetter])

  const chalkFont = { fontFamily: "'Segoe Print', 'Bradley Hand', 'Comic Sans MS', cursive" }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8"
      style={{ background: FRAME_DARK }}
    >
      <div
        className="w-full max-w-2xl rounded-lg p-3 sm:p-5"
        style={{ background: FRAME, boxShadow: "inset 0 0 0 4px rgba(0,0,0,0.25)" }}
      >
        <div
          className="rounded-md p-5 sm:p-8 flex flex-col items-center"
          style={{
            background: `radial-gradient(ellipse at top, ${CHALKBOARD} 0%, ${CHALKBOARD_DARK} 100%)`,
            minHeight: "560px",
          }}
        >
          <h1
            className="text-3xl sm:text-4xl mb-1 text-center"
            style={{ ...chalkFont, color: CHALK }}
          >
            Hangman
          </h1>
          <p className="text-sm mb-6 text-center" style={{ color: CHALK_DIM }}>
            Pratique vocabulário de inglês jogando forca
          </p>

          {screen === "menu" && (
            <div className="flex flex-col items-center gap-4 mt-6">
              <p className="text-lg" style={{ ...chalkFont, color: CHALK }}>
                Escolha a dificuldade
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                {["easy", "medium", "hard"].map((level) => (
                  <button
                    key={level}
                    onClick={() => startGame(level)}
                    className="px-6 py-3 rounded-md text-base transition-colors"
                    style={{
                      ...chalkFont,
                      color: CHALK,
                      border: `2px dashed ${CHALK_DIM}`,
                      background: "transparent",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(244,241,230,0.08)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {DIFFICULTY_LABELS[level]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {screen === "playing" && (
            <div className="w-full flex flex-col items-center gap-5">
              <div className="flex items-center justify-between w-full text-sm" style={{ color: CHALK_DIM }}>
                <span>Dificuldade: {DIFFICULTY_LABELS[difficulty]}</span>
                <span>
                  Erros: {wrongCount} / {MAX_WRONG}
                </span>
              </div>

              <div
                className="w-full text-center rounded-md px-4 py-3"
                style={{ border: `1px dashed ${CHALK_DIM}`, color: CHALK_YELLOW }}
              >
                Dica: {entry.hint}
              </div>

              <HangmanFigure wrongCount={wrongCount} />

              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                {letters.map((letter, index) => (
                  <span
                    key={index}
                    className="w-7 sm:w-9 text-center text-xl sm:text-2xl border-b-2 pb-1"
                    style={{ color: CHALK, borderColor: CHALK_DIM }}
                  >
                    {guessed.includes(letter) ? letter : "\u00A0"}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 min-h-[28px]">
                <span className="text-sm" style={{ color: CHALK_DIM }}>
                  Letras erradas:
                </span>
                <span className="text-base" style={{ color: CHALK_RED, ...chalkFont }}>
                  {wrong.length > 0 ? wrong.join(", ") : "—"}
                </span>
              </div>

              {!isWon && !isLost && (
                <div className="flex flex-col items-center gap-1.5 mt-1">
                  {KEYBOARD_ROWS.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex gap-1.5">
                      {row.map((letter) => {
                        const used = guessed.includes(letter) || wrong.includes(letter)
                        const correct = guessed.includes(letter)
                        return (
                          <button
                            key={letter}
                            onClick={() => guessLetter(letter)}
                            disabled={used}
                            className="w-7 h-8 sm:w-9 sm:h-10 rounded text-sm sm:text-base"
                            style={{
                              color: used ? (correct ? CHALK_GREEN : CHALK_RED) : CHALK,
                              border: `1px solid ${used ? "transparent" : CHALK_DIM}`,
                              background: used ? "rgba(0,0,0,0.2)" : "transparent",
                              opacity: used ? 0.6 : 1,
                              cursor: used ? "default" : "pointer",
                            }}
                          >
                            {letter}
                          </button>
                        )
                      })}
                    </div>
                  ))}
                </div>
              )}

              {(isWon || isLost) && (
                <div className="flex flex-col items-center gap-4 mt-2">
                  <p className="text-xl" style={{ ...chalkFont, color: isWon ? CHALK_GREEN : CHALK_RED }}>
                    {isWon ? "Você acertou!" : "Fim de jogo!"}
                  </p>
                  <p style={{ color: CHALK }}>
                    A palavra era: <strong>{word}</strong>
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => startGame(difficulty)}
                      className="px-4 py-2 rounded-md text-sm"
                      style={{ ...chalkFont, color: CHALK, border: `2px dashed ${CHALK_DIM}` }}
                    >
                      Jogar de novo
                    </button>
                    <button
                      onClick={() => setScreen("menu")}
                      className="px-4 py-2 rounded-md text-sm"
                      style={{ ...chalkFont, color: CHALK, border: `2px dashed ${CHALK_DIM}` }}
                    >
                      Trocar dificuldade
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
