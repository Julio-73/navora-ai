import { createBrowserRouter } from 'react-router-dom'

import { AppShell } from '@/shared/layouts/app-shell'
import { FoundationPage } from '@/pages/foundation-page'
import { NotFoundPage } from '@/pages/not-found-page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <FoundationPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
