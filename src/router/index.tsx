import { createBrowserRouter } from 'react-router'
import AppLayout from '../components/layout/AppLayout'
import HomePage from '../pages/HomePage'
import AboutPage from '../pages/AboutPage'
import CatGamePage from '../features/catgame/CatGamePage'

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
    }
])
