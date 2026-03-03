import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type Difficulty = 'easy' | 'normal' | 'hard' | 'expert'
export type GameMode = 'timed' | 'endless'
export type Theme = 'garden' | 'ocean' | 'sunset' | 'night' | 'candy' | 'forest'

export interface Position {
  x: number
  y: number
}

export interface DifficultySettings {
  speed: number
  size: number
  spawnRate: number
}

interface GameState {
  score: number
  highScore: number
  isPlaying: boolean
  targetPosition: Position
  targetSize: number
  difficulty: Difficulty
  gameMode: GameMode
  theme: Theme
  timeRemaining: number
  combo: number
  maxCombo: number

  comboMultiplier: () => number

  incrementScore: (points?: number) => void
  resetCombo: () => void
  setHighScore: (score: number) => void
  checkAndUpdateHighScore: () => void
  setTargetPosition: (x: number, y: number) => void
  randomizeTargetPosition: (containerWidth: number, containerHeight: number, padding?: number) => Position
  setTargetSize: (size: number) => void
  setDifficulty: (diff: Difficulty) => void
  setGameMode: (mode: GameMode) => void
  setTheme: (theme: Theme) => void
  startGame: () => void
  endGame: () => void
  setTimeRemaining: (time: number) => void
  decrementTime: () => number
  getDifficultySettings: () => DifficultySettings
  reset: () => void
  init: () => void
}

const DIFFICULTY_SETTINGS: Record<Difficulty, DifficultySettings> = {
  easy: { speed: 2, size: 80, spawnRate: 2000 },
  normal: { speed: 3.5, size: 60, spawnRate: 1500 },
  hard: { speed: 5, size: 45, spawnRate: 1000 },
  expert: { speed: 7, size: 35, spawnRate: 700 }
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      score: 0,
      highScore: 0,
      isPlaying: false,
      targetPosition: { x: 0, y: 0 },
      targetSize: 60,
      difficulty: 'normal',
      gameMode: 'timed',
      theme: 'garden',
      timeRemaining: 60,
      combo: 0,
      maxCombo: 0,

      comboMultiplier: () => Math.min(get().combo, 10),

      incrementScore: (points = 10) => {
        const newCombo = get().combo + 1
        set((state) => {
          const newMaxCombo = newCombo > state.maxCombo ? newCombo : state.maxCombo
          const bonusPoints = points * Math.min(newCombo, 10)
          return {
            score: state.score + bonusPoints,
            combo: newCombo,
            maxCombo: newMaxCombo
          }
        })
      },

      resetCombo: () => {
        set({ combo: 0 })
      },

      setHighScore: (score: number) => {
        set({ highScore: score })
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('catGameHighScore', score.toString())
        }
      },

      checkAndUpdateHighScore: () => {
        const { score, highScore } = get()
        if (score > highScore) {
          get().setHighScore(score)
        }
      },

      setTargetPosition: (x: number, y: number) => {
        set({ targetPosition: { x, y } })
      },

      randomizeTargetPosition: (containerWidth: number, containerHeight: number, padding = 80) => {
        const safeWidth = containerWidth - padding * 2
        const safeHeight = containerHeight - padding * 2
        const x = padding + Math.random() * safeWidth
        const y = padding + Math.random() * safeHeight
        const position = { x, y }
        set({ targetPosition: position })
        return position
      },

      setTargetSize: (size: number) => {
        set({ targetSize: size })
      },

      setDifficulty: (diff: Difficulty) => {
        set({ difficulty: diff })
        const settings = DIFFICULTY_SETTINGS[diff]
        if (settings) {
          set({ targetSize: settings.size })
        }
      },

      setGameMode: (mode: GameMode) => {
        set({ gameMode: mode })
      },

      setTheme: (theme: Theme) => {
        set({ theme })
      },

      startGame: () => {
        set({
          isPlaying: true,
          score: 0,
          combo: 0,
          timeRemaining: get().gameMode === 'timed' ? 60 : 0
        })
      },

      endGame: () => {
        get().checkAndUpdateHighScore()
        set({ isPlaying: false })
      },

      setTimeRemaining: (time: number) => {
        set({ timeRemaining: time })
      },

      decrementTime: () => {
        const { timeRemaining } = get()
        if (timeRemaining > 0) {
          const newTime = timeRemaining - 1
          set({ timeRemaining: newTime })
          return newTime
        }
        return 0
      },

      getDifficultySettings: () => {
        const { difficulty } = get()
        return DIFFICULTY_SETTINGS[difficulty] || DIFFICULTY_SETTINGS.normal
      },

      reset: () => {
        set({
          score: 0,
          isPlaying: false,
          targetPosition: { x: 0, y: 0 },
          combo: 0,
          timeRemaining: 60
        })
      },

      init: () => {
        if (typeof localStorage !== 'undefined') {
          const saved = localStorage.getItem('catGameHighScore')
          if (saved) {
            set({ highScore: parseInt(saved, 10) })
          }
        }
      }
    }),
    {
      name: 'catgame-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        highScore: state.highScore,
        difficulty: state.difficulty,
        gameMode: state.gameMode,
        theme: state.theme
      })
    }
  )
)
