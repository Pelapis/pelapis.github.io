import { createBrowserRouter, RouterProvider } from 'react-router'
import { AppLayout } from '../components/layout/AppLayout'
import { InvestmentPage } from '../pages/InvestmentPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AppLayout>
        <InvestmentPage />
      </AppLayout>
    ),
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
