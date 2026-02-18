import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { InvestmentPage } from '../pages/InvestmentPage'
import { SnakePage } from '../pages/SnakePage'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AppLayout>
        <Outlet />
      </AppLayout>
    ),
    children: [
      {
        index: true,
        element: <InvestmentPage />,
      },
      {
        path: 'snake',
        element: <SnakePage />,
      },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
