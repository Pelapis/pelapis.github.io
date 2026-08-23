import { atom, useAtomValue, useSetAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

export type Difficulty = "easy" | "normal" | "hard" | "expert"
export type GameMode = "timed" | "endless"
export type Theme = "garden" | "ocean" | "sunset" | "night" | "candy" | "forest"

export interface Position {
  x: number
  y: number
}

export const DIFFICULTY_SETTINGS = {
  easy: { speed: 2, size: 80, spawnRate: 2000 },
  normal: { speed: 3.5, size: 60, spawnRate: 1500 },
  hard: { speed: 5, size: 45, spawnRate: 1000 },
  expert: { speed: 7, size: 35, spawnRate: 700 },
} as const

// ---------- 持久化(设置类) ----------

export const highScoreAtom = atomWithStorage<number>("catGameHighScore", 0)
export const difficultyAtom = atomWithStorage<Difficulty>(
  "catgame:difficulty",
  "normal"
)
export const gameModeAtom = atomWithStorage<GameMode>("catgame:gameMode", "timed")
export const themeAtom = atomWithStorage<Theme>("catgame:theme", "garden")

export const targetSizeAtom = atom<number>(
  (get) => DIFFICULTY_SETTINGS[get(difficultyAtom)].size
)

// ---------- 会话内(对局状态) ----------

export const scoreAtom = atom(0)
export const comboAtom = atom(0)
export const maxComboAtom = atom(0)
export const timeRemainingAtom = atom(60)
export const isPlayingAtom = atom(false)
export const targetPositionAtom = atom<Position>({ x: 0, y: 0 })

// ---------- 派生 ----------

export const isNewRecordAtom = atom((get) => {
  const score = get(scoreAtom)
  return score > 0 && score >= get(highScoreAtom)
})

// ---------- 动作 ----------

export const incrementScoreAtom = atom(null, (get, set, points: number = 10) => {
  const newCombo = get(comboAtom) + 1
  set(comboAtom, newCombo)
  set(maxComboAtom, Math.max(get(maxComboAtom), newCombo))
  set(scoreAtom, get(scoreAtom) + points * Math.min(newCombo, 10))
})

export const resetComboAtom = atom(null, (_, set) => set(comboAtom, 0))

export const randomizeTargetAtom = atom(
  null,
  (
    _,
    set,
    width: number,
    height: number,
    padding: number = 80
  ) => {
    set(targetPositionAtom, {
      x: padding + Math.random() * (width - padding * 2),
      y: padding + Math.random() * (height - padding * 2),
    })
  }
)

export const startGameAtom = atom(null, (get, set) => {
  set(scoreAtom, 0)
  set(comboAtom, 0)
  set(timeRemainingAtom, get(gameModeAtom) === "timed" ? 60 : 0)
  set(isPlayingAtom, true)
})

export const endGameAtom = atom(null, (get, set) => {
  if (get(scoreAtom) > get(highScoreAtom)) {
    set(highScoreAtom, get(scoreAtom))
  }
  set(isPlayingAtom, false)
})

export const decrementTimeAtom = atom(null, (get, set) => {
  const remaining = get(timeRemainingAtom)
  const next = Math.max(0, remaining - 1)
  set(timeRemainingAtom, next)
  return next
})

export const resetGameAtom = atom(null, (_, set) => {
  set(scoreAtom, 0)
  set(comboAtom, 0)
  set(maxComboAtom, 0)
  set(targetPositionAtom, { x: 0, y: 0 })
  set(isPlayingAtom, false)
})

// ---------- 便捷 hooks ----------

export const useCatGame = () => ({
  score: useAtomValue(scoreAtom),
  combo: useAtomValue(comboAtom),
  maxCombo: useAtomValue(maxComboAtom),
  highScore: useAtomValue(highScoreAtom),
  timeRemaining: useAtomValue(timeRemainingAtom),
  isPlaying: useAtomValue(isPlayingAtom),
  targetPosition: useAtomValue(targetPositionAtom),
  isNewRecord: useAtomValue(isNewRecordAtom),
  incrementScore: useSetAtom(incrementScoreAtom),
  resetCombo: useSetAtom(resetComboAtom),
  randomizeTarget: useSetAtom(randomizeTargetAtom),
  startGame: useSetAtom(startGameAtom),
  endGame: useSetAtom(endGameAtom),
  decrementTime: useSetAtom(decrementTimeAtom),
  resetGame: useSetAtom(resetGameAtom),
})

export const useSettings = () => ({
  difficulty: useAtomValue(difficultyAtom),
  gameMode: useAtomValue(gameModeAtom),
  theme: useAtomValue(themeAtom),
  targetSize: useAtomValue(targetSizeAtom),
  setDifficulty: useSetAtom(difficultyAtom),
  setGameMode: useSetAtom(gameModeAtom),
  setTheme: useSetAtom(themeAtom),
})
