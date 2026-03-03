import { useEffect, useRef } from 'react'
import { useGameStore } from '../../store/gameStore'
import type { Direction } from '../../store/gameStore'

const WIDTH = 380 * 2
const HEIGHT = 380 * 2
const CELL_COUNT = 17

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const {
    snake,
    food,
    currentDirection,
    score,
    isGameOver,
    isPlaying,
    setSnake,
    setFood,
    setCurrentDirection,
    setScore,
    setIsGameOver,
    setIsPlaying,
    resetGame,
  } = useGameStore()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, WIDTH, HEIGHT)

    ctx.strokeStyle = '#9ca3af'
    ctx.lineWidth = 1

    for (let i = 0; i <= CELL_COUNT; i++) {
      const x = (i * WIDTH) / CELL_COUNT
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, HEIGHT)
      ctx.stroke()
    }

    for (let i = 0; i <= CELL_COUNT; i++) {
      const y = (i * HEIGHT) / CELL_COUNT
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(WIDTH, y)
      ctx.stroke()
    }

    const cellWidth = WIDTH / CELL_COUNT
    const cellHeight = HEIGHT / CELL_COUNT

    for (const [x, y] of snake) {
      ctx.fillStyle = '#1f2937'
      ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth - 1, cellHeight - 1)
    }

    ctx.fillStyle = '#ef4444'
    ctx.fillRect(food[0] * cellWidth, food[1] * cellHeight, cellWidth - 1, cellHeight - 1)
  }, [snake, food])

  useEffect(() => {
    if (!isPlaying || isGameOver) return

    const interval = setInterval(() => {
      const newSnake = [...snake]
      const head = newSnake[0]

      let newHead: [number, number] = [0, 0]
      switch (currentDirection) {
        case 'Up':
          newHead = [head[0], (head[1] + CELL_COUNT - 1) % CELL_COUNT]
          break
        case 'Down':
          newHead = [head[0], (head[1] + 1) % CELL_COUNT]
          break
        case 'Left':
          newHead = [(head[0] + CELL_COUNT - 1) % CELL_COUNT, head[1]]
          break
        case 'Right':
          newHead = [head[0] + 1, head[1]]
          break
        default:
          newHead = [head[0], head[1]]
          break
      }

      for (const [x, y] of newSnake) {
        if (newHead[0] === x && newHead[1] === y) {
          setIsGameOver(true)
          setIsPlaying(false)
          alert(`游戏结束！您的得分是：${score}！`)
          return
        }
      }

      newSnake.unshift(newHead)

      if (newHead[0] === food[0] && newHead[1] === food[1]) {
        setFood([Math.floor(Math.random() * CELL_COUNT), Math.floor(Math.random() * CELL_COUNT)])
        setScore(score + 1)
      } else {
        newSnake.pop()
      }

      setSnake(newSnake)
    }, 900 / (snake.length + 3) + 100)

    return () => clearInterval(interval)
  }, [snake, food, currentDirection, score, isPlaying, isGameOver, setSnake, setFood, setScore, setIsGameOver, setIsPlaying])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key

      if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight') {
        event.preventDefault()
      }

      let newDirection: Direction | null = null
      switch (key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          newDirection = 'Up'
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          newDirection = 'Down'
          break
        case 'ArrowLeft':
        case 'a':
        case 'A':
          newDirection = 'Left'
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          newDirection = 'Right'
          break
      }

      if (newDirection) {
        const reverseMap: Record<Direction, Direction> = {
          Up: 'Down',
          Down: 'Up',
          Left: 'Right',
          Right: 'Left',
        }

        if (newDirection !== reverseMap[currentDirection]) {
          setCurrentDirection(newDirection)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentDirection, setCurrentDirection])

  const handleTouchEnd = (event: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = event.changedTouches[0]
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    const direction = y > x ? (x + y > HEIGHT / 2 ? 'Down' : 'Left') : x + y > HEIGHT / 2 ? 'Right' : 'Up'

    const reverseMap: Record<Direction, Direction> = {
      Up: 'Down',
      Down: 'Up',
      Left: 'Right',
      Right: 'Left',
    }

    if (direction !== currentDirection && direction !== reverseMap[currentDirection]) {
      setCurrentDirection(direction)
    }
  }

  const handleStartGame = () => {
    if (!isPlaying) {
      resetGame()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">贪吃蛇</h1>
      </header>
      <main className="flex flex-col items-center gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">
            得分：<span className="text-blue-600">{score}</span>
          </h3>
          <canvas
            ref={canvasRef}
            width={WIDTH}
            height={HEIGHT}
            style={{ width: `${WIDTH / 2}px`, height: `${HEIGHT / 2}px`, touchAction: 'none' }}
            onTouchEnd={handleTouchEnd}
            className="block border border-gray-300 rounded-lg cursor-pointer"
          />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm text-gray-500">手机：点击画面上下左右</p>
          <p className="text-sm text-gray-500">电脑：W A S D 键或上下左右键</p>
        </div>
        <button
          onClick={handleStartGame}
          className={`px-8 py-3 rounded-lg text-white font-semibold transition-all duration-200 ${
            isPlaying
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
          }`}
          disabled={isPlaying}
        >
          {!isPlaying && !isGameOver ? '开始游戏' : isGameOver ? '重新开始' : '游戏中'}
        </button>
      </main>
    </div>
  )
}
