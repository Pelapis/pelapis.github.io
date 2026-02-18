import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useGameStore } from '@/stores/gameStore'
import { MovingTarget } from '@/components/game/MovingTarget'
import { TouchEffect } from '@/components/game/TouchEffect'
import './GamePage.css'

interface TouchEffectData {
    id: number
    x: number
    y: number
}

interface GamePageProps {
    onBackToMenu: () => void
}

const THEME_BACKGROUNDS: Record<string, string> = {
    garden: 'linear-gradient(180deg, #a8e063 0%, #56ab2f 100%)',
    ocean: 'linear-gradient(180deg, #2193b0 0%, #6dd5ed 100%)',
    sunset: 'linear-gradient(180deg, #ff512f 0%, #dd2476 100%)',
    night: 'linear-gradient(180deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    candy: 'linear-gradient(180deg, #f093fb 0%, #f5576c 100%)',
    forest: 'linear-gradient(180deg, #134e5e 0%, #71b280 100%)'
}

export function GamePage({ onBackToMenu }: GamePageProps) {
    const store = useGameStore()
    const containerRef = useRef<HTMLDivElement>(null)
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
    const [showGameOver, setShowGameOver] = useState(false)
    const [touchEffects, setTouchEffects] = useState<TouchEffectData[]>([])
    const [gameKey, setGameKey] = useState(0)

    const animationFrameRef = useRef<number | null>(null)
    const timerIntervalRef = useRef<number | null>(null)

    const handleGameOver = () => {
        store.endGame()
        setShowGameOver(true)
    }

    const handleTargetHit = () => {
        store.incrementScore(10)
        setTouchEffects((prev) => [
            ...prev,
            { id: Date.now(), x: store.targetPosition.x, y: store.targetPosition.y }
        ])

        setTimeout(() => {
            setTouchEffects((prev) => prev.slice(1))
        }, 500)

        if (dimensions.width > 0 && dimensions.height > 0) {
            store.randomizeTargetPosition(dimensions.width, dimensions.height)
        }
    }

    const handleBackToMenu = () => {
        store.endGame()
        onBackToMenu()
    }

    const handlePlayAgain = () => {
        store.endGame()
        setShowGameOver(false)
        setGameKey((prev) => prev + 1)
        store.startGame()

        if (dimensions.width > 0 && dimensions.height > 0) {
            store.randomizeTargetPosition(dimensions.width, dimensions.height)
        }

        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current)
        }

        const updateGame = () => {
            if (store.isPlaying) {
                animationFrameRef.current = requestAnimationFrame(updateGame)
            }
        }
        animationFrameRef.current = requestAnimationFrame(updateGame)

        if (store.gameMode === 'timed') {
            store.setTimeRemaining(60)
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current)
            }
            timerIntervalRef.current = window.setInterval(() => {
                const remaining = store.decrementTime()
                if (remaining <= 0 && timerIntervalRef.current !== null) {
                    clearInterval(timerIntervalRef.current)
                    timerIntervalRef.current = null
                    handleGameOver()
                }
            }, 1000)
        }
    }

    const handleContainerClick = (e: React.MouseEvent | React.TouchEvent) => {
        const target = e.target as HTMLElement
        if (target === containerRef.current || target.classList.contains('game-page__background')) {
            store.resetCombo()
        }
    }

    useEffect(() => {
        store.init()
    }, [])

    useEffect(() => {
        store.startGame()

        if (dimensions.width === 0) {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect()
                setDimensions({ width: rect.width, height: rect.height })
                if (store.targetPosition.x === 0 && store.targetPosition.y === 0) {
                    store.randomizeTargetPosition(rect.width, rect.height)
                }
            }
        }

        if (store.gameMode === 'timed') {
            timerIntervalRef.current = window.setInterval(() => {
                const remaining = store.decrementTime()
                if (remaining <= 0 && timerIntervalRef.current !== null) {
                    clearInterval(timerIntervalRef.current)
                    timerIntervalRef.current = null
                    handleGameOver()
                }
            }, 1000)
        }

        const updateGame = () => {
            if (store.isPlaying) {
                animationFrameRef.current = requestAnimationFrame(updateGame)
            }
        }
        animationFrameRef.current = requestAnimationFrame(updateGame)

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setDimensions({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height
                })
            }
        })

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current)
        }

        return () => {
            store.endGame()

            resizeObserver.disconnect()

            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }

            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current)
            }
        }
    }, [])

    useEffect(() => {
        const settings = store.getDifficultySettings()
        store.setTargetSize(settings.size)
    }, [store.difficulty])

    const themeBackground = THEME_BACKGROUNDS[store.theme] || THEME_BACKGROUNDS.garden
    const showTimer = store.gameMode === 'timed'
    const isTimeWarning = showTimer && store.timeRemaining <= 10

    return (
        <div
            className="game-page"
            style={{ background: themeBackground }}
            ref={containerRef}
            onClick={handleContainerClick}
        >
            <div className="game-page__ui-layer">
                <div className="game-page__header">
                    <button className="game-page__back-btn" onClick={handleBackToMenu}>
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                        </svg>
                    </button>

                    <div className="game-page__score-display">
                        <div className="game-page__score">
                            <span className="game-page__score-label">得分</span>
                            <span className="game-page__score-value">{store.score}</span>
                        </div>
                        {store.combo > 1 && (
                            <div className="game-page__combo">
                                <span className="game-page__combo-value">×{store.combo}</span>
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
                            <span className={`game-page__timer-value ${isTimeWarning ? 'game-page__timer-value--warning' : ''}`}>
                                {store.timeRemaining}s
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="game-page__game-area">
                {dimensions.width > 0 && dimensions.height > 0 && (
                    <MovingTarget
                        key={gameKey}
                        position={store.targetPosition}
                        size={store.targetSize}
                        difficulty={store.difficulty}
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

            {showGameOver && createPortal(
                <div className="game-page__overlay">
                    <div className="game-page__game-over-modal">
                        <h2 className="game-page__game-over-title">游戏结束!</h2>

                        <div className="game-page__final-stats">
                            <div className="game-page__final-score">
                                <span className="game-page__final-score-label">最终得分</span>
                                <span className="game-page__final-score-value">{store.score}</span>
                            </div>

                            {store.score > 0 && (
                                <div className="game-page__final-detail">
                                    <span>最高连击:</span>
                                    <span>{store.maxCombo}x</span>
                                </div>
                            )}

                            {store.score >= store.highScore && store.score > 0 && (
                                <div className="game-page__new-record">
                                    🎉 新纪录!
                                </div>
                            )}
                        </div>

                        <div className="game-page__modal-buttons">
                            <button className="game-page__modal-btn game-page__modal-btn--primary" onClick={handlePlayAgain}>
                                再来一局
                            </button>
                            <button className="game-page__modal-btn game-page__modal-btn--secondary" onClick={handleBackToMenu}>
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
