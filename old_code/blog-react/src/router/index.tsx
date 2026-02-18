import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import HomePage from '../pages/HomePage'
import ProjectsPage from '../pages/ProjectsPage'
import ProjectDetailPage from '../pages/ProjectDetailPage'
import AboutPage from '../pages/AboutPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'projects',
        element: <ProjectsPage />
      },
      {
        path: 'project/:id',
        element: <ProjectDetailPage />
      },
      {
        path: 'about',
        element: <AboutPage />
      }
    ]
  }
])
