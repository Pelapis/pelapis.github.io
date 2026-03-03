import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router'
import AppLayout from './components/layout/AppLayout'
import HomePage from './features/home/HomePage'
import AboutPage from './features/home/AboutPage'
import CatGamePage from './features/catgame'
import SnakeGamePage from './features/snake'
import InvestPage from './features/invest'

const router = createBrowserRouter([
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
    },
    {
        path: 'invest',
        element: <InvestPage />
    },
])

export default function App() {
    return (<RouterProvider router={router} />)
}
