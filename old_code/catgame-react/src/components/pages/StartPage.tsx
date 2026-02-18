import { useGameStore } from '@/stores/gameStore'
import { GameOptions } from '@/components/game/GameOptions'
import { ThemeSelector } from '@/components/game/ThemeSelector'
import './StartPage.css'

interface StartPageProps {
    onStartGame: () => void
}

export function StartPage({ onStartGame }: StartPageProps) {
    const { theme } = useGameStore()

    const getThemeBackground = (): string => {
        const backgrounds: Record<string, string> = {
            garden: 'linear-gradient(180deg, #a8e063 0%, #56ab2f 100%)',
            ocean: 'linear-gradient(180deg, #2193b0 0%, #6dd5ed 100%)',
            sunset: 'linear-gradient(180deg, #ff512f 0%, #dd2476 100%)',
            night: 'linear-gradient(180deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
            candy: 'linear-gradient(180deg, #f093fb 0%, #f5576c 100%)',
            forest: 'linear-gradient(180deg, #134e5e 0%, #71b280 100%)'
        }
        return backgrounds[theme] || backgrounds.garden
    }

    return (
        <div className="start-page" style={{ background: getThemeBackground() }}>
            <div className="start-page__header">
                <h1 className="start-page__title">猫咪抓抓</h1>
                <p className="start-page__subtitle">Cat Catch Game</p>
            </div>

            <div className="start-page__scroll-container">
                <div className="start-page__options-wrapper">
                    <div className="start-page__game-options">
                        <GameOptions />
                    </div>

                    <div className="start-page__theme-section">
                        <h3 className="start-page__section-title">选择主题</h3>
                        <ThemeSelector />
                    </div>
                </div>
            </div>

            <div className="start-page__footer">
                <button className="start-page__start-button" onClick={onStartGame}>
                    开始游戏
                </button>
                <p className="start-page__instructions">
                    用你的手指帮助猫咪抓住随机移动的小鱼！
                </p>
            </div>
        </div>
    )
}
