"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useAtomValue, useSetAtom } from "jotai"
import {
  comboAtom,
  decrementTimeAtom,
  difficultyAtom,
  endGameAtom,
  gameModeAtom,
  incrementScoreAtom,
  isNewRecordAtom,
  isPlayingAtom,
  maxComboAtom,
  randomizeTargetAtom,
  resetComboAtom,
  scoreAtom,
  startGameAtom,
  targetPositionAtom,
  targetSizeAtom,
  themeAtom,
  timeRemainingAtom,
} from "./atoms"
import { MovingTarget } from "./MovingTarget"
import { TouchEffect } from "./TouchEffect"
import "./GamePage.css"

interface TouchEffectData {
  id: number
  x: number
  y: number
}

interface GamePageProps {
  onBackToMenu: () => void
}

const THEME_BACKGROUNDS: Record<string, string> = {
  garden: "linear-gradient(180deg, #a8e063 0%, #56ab2f 100%)",
  ocean: "linear-gradient(180deg, #2193b0 0%, #6dd5ed 100%)",
  sunset: "linear-gradient(180deg, #ff512f 0%, #dd2476 100%)",
  night: "linear-gradient(180deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
  candy: "linear-gradient(180deg, #f093fb 0%, #f5576c 100%)",
  forest: "linear-gradient(180deg, #134e5e 0%, #71b280 100%)",
}

export function GamePage({ onBackToMenu }: GamePageProps) {
  const score = useAtomValue(scoreAtom)
  const combo = useAtomValue(comboAtom)
  const maxCombo = useAtomValue(maxComboAtom)
  const timeRemaining = useAtomValue(timeRemainingAtom)
  const isPlaying = useAtomValue(isPlayingAtom)
  const targetPosition = useAtomValue(targetPositionAtom)
  const targetSize = useAtomValue(targetSizeAtom)
  const difficulty = useAtomValue(difficultyAtom)
  const gameMode = useAtomValue(gameModeAtom)
  const theme = useAtomValue(themeAtom)
  const isNewRecord = useAtomValue(isNewRecordAtom)

  const incrementScore = useSetAtom(incrementScoreAtom)
  const resetCombo = useSetAtom(resetComboAtom)
  const randomizeTarget = useSetAtom(randomizeTargetAtom)
  const startGame = useSetAtom(startGameAtom)
  const endGame = useSetAtom(endGameAtom)
  const decrementTime = useSetAtom(decrementTimeAtom)

  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [showGameOver, setShowGameOver] = useState(false)
  const [touchEffects, setTouchEffects] = useState<TouchEffectData[]>([])
  const [gameKey, setGameKey] = useState(0)

  // 定时器回调里读取最新状态用的 ref
  const posRef = useRef(targetPosition)
  posRef.current = targetPosition

  const stopRef = useRef(() => {})
  stopRef.current = () => {
    endGame()
    setShowGameOver(true)
  }

  // 挂载:开始游戏、测量容器、监听尺寸变化
  useEffect(() => {
    startGame()

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setDimensions({ width: rect.width, height: rect.height })
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        })
      }
    })
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      endGame()
      resizeObserver.disconnect()
    }
  }, [])

  // 限时模式倒计时,时间耗尽自动结算
  useEffect(() => {
    if (gameMode !== "timed" || !isPlaying) return

    const timer = window.setInterval(() => {
      const remaining = decrementTime()
      if (remaining <= 0) stopRef.current()
    }, 1000)

    return () => clearInterval(timer)
  }, [gameMode, isPlaying, decrementTime])

  // 初始位置(容器尺寸就绪后)
  useEffect(() => {
    if (dimensions.width > 0 && targetPosition.x === 0 && targetPosition.y === 0) {
      randomizeTarget(dimensions.width, dimensions.height)
    }
  }, [dimensions.width, dimensions.height, targetPosition.x, targetPosition.y, randomizeTarget])

  const handleTargetHit = () => {
    incrementScore(10)
    const { x, y } = posRef.current
    setTouchEffects((prev) => [...prev, { id: Date.now(), x, y }])
    setTimeout(() => {
      setTouchEffects((prev) => prev.slice(1))
    }, 500)

    if (dimensions.width > 0 && dimensions.height > 0) {
      randomizeTarget(dimensions.width, dimensions.height)
    }
  }

  const handlePlayAgain = () => {
    setShowGameOver(false)
    setGameKey((prev) => prev + 1)
    startGame()
  }

  const handleBack = () => {
    endGame()
    onBackToMenu()
  }

  const handleContainerClick = (e: React.MouseEvent | React.TouchEvent) => {
    const target = e.target as HTMLElement
    if (
      target === containerRef.current ||
      target.classList.contains("game-page__background")
    ) {
      resetCombo()
    }
  }

  const themeBackground = THEME_BACKGROUNDS[theme] || THEME_BACKGROUNDS.garden
  const showTimer = gameMode === "timed"
  const isTimeWarning = showTimer && timeRemaining <= 10

  return (
    <div
      className="game-page"
      style={{ background: themeBackground }}
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div className="game-page__ui-layer">
        <div className="game-page__header">
          <button className="game-page__back-btn" onClick={handleBack}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          </button>

          <div className="game-page__score-display">
            <div className="game-page__score">
              <span className="game-page__score-label">得分</span>
              <span className="game-page__score-value">{score}</span>
            </div>
            {combo > 1 && (
              <div className="game-page__combo">
                <span className="game-page__combo-value">×{combo}</span>
                <span className="game-page__combo-label">连击!</span>
              </div>
            )}
          </div>

          {showTimer && (
            <div className="game-page__timer">
              <svg className="game-page__timer-icon" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
              <span className={`game-page__timer-value ${isTimeWarning ? "game-page__timer-value--warning" : ""}`}>
                {timeRemaining}s
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="game-page__game-area">
        {dimensions.width > 0 && dimensions.height > 0 && (
          <MovingTarget
            key={gameKey}
            position={targetPosition}
            size={targetSize}
            difficulty={difficulty}
            containerWidth={dimensions.width}
            containerHeight={dimensions.height}
            onHit={handleTargetHit}
          />
        )}

        {touchEffects.map((effect) => (
          <TouchEffect
            key={effect.id}
            x={effect.x}
            y={effect.y}
            onComplete={() => {
              setTouchEffects((prev) => prev.filter((e) => e.id !== effect.id))
            }}
          />
        ))}
      </div>

      {showGameOver &&
        createPortal(
          <div className="game-page__overlay">
            <div className="game-page__game-over-modal">
              <h2 className="game-page__game-over-title">游戏结束!</h2>

              <div className="game-page__final-stats">
                <div className="game-page__final-score">
                  <span className="game-page__final-score-label">最终得分</span>
                  <span className="game-page__final-score-value">{score}</span>
                </div>

                {score > 0 && (
                  <div className="game-page__final-detail">
                    <span>最高连击:</span>
                    <span>{maxCombo}x</span>
                  </div>
                )}

                {isNewRecord && score > 0 && (
                  <div className="game-page__new-record">🎉 新纪录!</div>
                )}
              </div>

              <div className="game-page__modal-buttons">
                <button className="game-page__modal-btn game-page__modal-btn--primary" onClick={handlePlayAgain}>
                  再来一局
                </button>
                <button className="game-page__modal-btn game-page__modal-btn--secondary" onClick={handleBack}>
                  返回菜单
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
