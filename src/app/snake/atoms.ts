import { atom } from "jotai"

export type Direction = "Up" | "Down" | "Left" | "Right"

export interface GameState {
  snake: [number, number][]
  food: [number, number]
  currentDirection: Direction
  score: number
  isGameOver: boolean
  isPlaying: boolean
}

export const CELL_COUNT = 17

const initialSnake = (): [number, number][] => [
  [Math.floor(CELL_COUNT / 2), CELL_COUNT - 3],
  [Math.floor(CELL_COUNT / 2), CELL_COUNT - 2],
  [Math.floor(CELL_COUNT / 2), CELL_COUNT - 1],
]

const initialFood = (): [number, number] => [
  Math.floor(Math.random() * CELL_COUNT),
  Math.floor(Math.random() * CELL_COUNT),
]

const initialState = (): GameState => ({
  snake: initialSnake(),
  food: initialFood(),
  currentDirection: "Up",
  score: 0,
  isGameOver: false,
  isPlaying: false,
})

export const gameStateAtom = atom<GameState>(initialState())

export const resetGameAtom = atom(null, (_, set) => {
  set(gameStateAtom, {
    snake: initialSnake(),
    food: initialFood(),
    currentDirection: "Up",
    score: 0,
    isGameOver: false,
    isPlaying: true,
  })
})

export const setDirectionAtom = atom(
  null,
  (get, set, direction: Direction) => {
    const reverseMap: Record<Direction, Direction> = {
      Up: "Down",
      Down: "Up",
      Left: "Right",
      Right: "Left",
    }
    const { currentDirection } = get(gameStateAtom)
    if (direction !== reverseMap[currentDirection]) {
      set(gameStateAtom, { ...get(gameStateAtom), currentDirection: direction })
    }
  }
)

export const togglePlayAtom = atom(null, (get, set) => {
  const state = get(gameStateAtom)
  set(gameStateAtom, { ...state, isPlaying: !state.isPlaying })
})

// 游戏主循环:每 tick 移动一格
export const stepAtom = atom(null, (get, set) => {
  const state = get(gameStateAtom)
  if (!state.isPlaying || state.isGameOver) return

  const { snake, food, currentDirection, score } = state
  const head = snake[0]

  let newHead: [number, number]
  switch (currentDirection) {
    case "Up":
      newHead = [head[0], (head[1] + CELL_COUNT - 1) % CELL_COUNT]
      break
    case "Down":
      newHead = [head[0], (head[1] + 1) % CELL_COUNT]
      break
    case "Left":
      newHead = [(head[0] + CELL_COUNT - 1) % CELL_COUNT, head[1]]
      break
    case "Right":
      newHead = [(head[0] + 1) % CELL_COUNT, head[1]]
      break
  }

  // 撞到自己 → 游戏结束
  if (snake.some(([x, y]) => newHead[0] === x && newHead[1] === y)) {
    set(gameStateAtom, { ...state, isGameOver: true, isPlaying: false })
    return
  }

  const newSnake = [...snake, newHead]

  let newFood = food
  let newScore = score
  if (newHead[0] === food[0] && newHead[1] === food[1]) {
    newFood = initialFood()
    newScore = score + 1
  } else {
    newSnake.shift()
  }
  newSnake.shift()

  set(gameStateAtom, {
    ...state,
    snake: newSnake,
    food: newFood,
    score: newScore,
  })
})
