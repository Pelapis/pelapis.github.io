import { createBrowserRouter } from 'react-router'
import AppLayout from '../components/layout/AppLayout'
import HomePage from '../features/home/HomePage'
import AboutPage from '../features/home/AboutPage'
import CatGamePage from '../features/catgame/CatGamePage'
import SnakeGamePage from '../features/snake/SnakeGamePage'

export const router = createBrowserRouter([
    {
        element: <AppLayout />,
        children: [
            {
                path: '/',
                element: <HomePage />
            },
            {
                path: 'about',
                element: <AboutPage />
            }
        ]
    },
    {
        path: 'catgame',
        element: <CatGamePage />
    },
    {
        path: 'snake',
        element: <SnakeGamePage />
    }
])
