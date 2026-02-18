import { useGameStore } from '@/stores/gameStore'
import type { Difficulty, GameMode } from '@/stores/gameStore'
import './GameOptions.css'

interface DifficultyOption {
  id: Difficulty
  label: string
}

interface GameModeOption {
  id: GameMode
  label: string
  description: string
  icon: string
}

const difficulties: DifficultyOption[] = [
  { id: 'easy', label: '简单' },
  { id: 'normal', label: '普通' },
  { id: 'hard', label: '困难' },
  { id: 'expert', label: '专家' }
]

const gameModes: GameModeOption[] = [
  { id: 'timed', label: '限时', description: '60秒内尽可能多得分', icon: '⏱️' },
  { id: 'endless', label: '无限', description: '一直玩到累为止', icon: '♾️' }
]

export function GameOptions() {
  const { difficulty, gameMode, setDifficulty, setGameMode } = useGameStore()

  return (
    <div className="game-options">
      <div className="game-options__section">
        <h3 className="game-options__title">选择难度</h3>
        <div className="game-options__difficulty">
          {difficulties.map((item) => (
            <button
              key={item.id}
              className={`game-options__difficulty-btn ${difficulty === item.id ? 'game-options__difficulty-btn--active' : ''}`}
              onClick={() => setDifficulty(item.id)}
            >
              <span className="game-options__difficulty-label">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="game-options__section">
        <h3 className="game-options__title">选择模式</h3>
        <div className="game-options__modes">
          {gameModes.map((item) => (
            <button
              key={item.id}
              className={`game-options__mode-btn ${gameMode === item.id ? 'game-options__mode-btn--active' : ''}`}
              onClick={() => setGameMode(item.id)}
            >
              <span className="game-options__mode-icon">{item.icon}</span>
              <div className="game-options__mode-text">
                <span className="game-options__mode-label">{item.label}</span>
                <span className="game-options__mode-desc">{item.description}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
