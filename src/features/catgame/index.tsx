import { useState, useCallback } from 'react'
import { StartPage } from './components/pages/StartPage'
import { GamePage } from './components/pages/GamePage'
import './App.css'

export default function CatGamePage() {
    const [currentPage, setCurrentPage] = useState<'start' | 'game'>('start')

    const handleStartGame = useCallback(() => {
        setCurrentPage('game')
    }, [])

    const handleBackToMenu = useCallback(() => {
        setCurrentPage('start')
    }, [])

    return (
        <div className="app-container">
            {currentPage === 'start' && <StartPage onStartGame={handleStartGame} />}
            {currentPage === 'game' && <GamePage onBackToMenu={handleBackToMenu} />}
        </div>
    )
}
