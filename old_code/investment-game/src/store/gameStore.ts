import { create } from 'zustand'

export type Direction = 'Up' | 'Down' | 'Left' | 'Right'

interface GameState {
  snake: [number, number][]
  food: [number, number]
  currentDirection: Direction
  score: number
  isGameOver: boolean
  isPlaying: boolean
  setSnake: (snake: [number, number][]) => void
  setFood: (food: [number, number]) => void
  setCurrentDirection: (direction: Direction) => void
  setScore: (score: number) => void
  setIsGameOver: (isGameOver: boolean) => void
  setIsPlaying: (isPlaying: boolean) => void
  resetGame: () => void
}

const CELL_COUNT = 17

export const useGameStore = create<GameState>((set) => ({
  snake: [
    [Math.floor(CELL_COUNT / 2), CELL_COUNT - 3],
    [Math.floor(CELL_COUNT / 2), CELL_COUNT - 2],
    [Math.floor(CELL_COUNT / 2), CELL_COUNT - 1],
  ],
  food: [
    Math.floor(Math.random() * CELL_COUNT),
    Math.floor(Math.random() * CELL_COUNT),
  ],
  currentDirection: 'Up',
  score: 0,
  isGameOver: false,
  isPlaying: false,
  setSnake: (snake) => set({ snake }),
  setFood: (food) => set({ food }),
  setCurrentDirection: (currentDirection) => set({ currentDirection }),
  setScore: (score) => set({ score }),
  setIsGameOver: (isGameOver) => set({ isGameOver }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  resetGame: () =>
    set({
      snake: [
        [Math.floor(CELL_COUNT / 2), CELL_COUNT - 3],
        [Math.floor(CELL_COUNT / 2), CELL_COUNT - 2],
        [Math.floor(CELL_COUNT / 2), CELL_COUNT - 1],
      ],
      food: [
        Math.floor(Math.random() * CELL_COUNT),
        Math.floor(Math.random() * CELL_COUNT),
      ],
      currentDirection: 'Up',
      score: 0,
      isGameOver: false,
      isPlaying: true,
    }),
}))
