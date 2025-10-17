import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { ToastProvider } from './context/ToastContext'

import AuthorDashboard from './routes/AuthorDashboard'
import CreateNovel from './routes/CreateNovel'
import Favorites from './routes/Favorites'
import Follows from './routes/Follows'
import Home from './routes/Home'
import Novel from './routes/Novel'
import Profile from './routes/Profile'
import ReadLater from './routes/ReadLater'
import Search from './routes/ReadLater'
import Login from './routes/Login'
import Register from './routes/Register'

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/author-dashboard/:id", element: <AuthorDashboard /> },
  { path: "/create", element: <CreateNovel /> },
  { path: "/favorites", element: <Favorites /> },
  { path: "/follows", element: <Follows /> },
  { path: "/read-later", element: <ReadLater /> },
  { path: "/profile/:id", element: <Profile /> },
  { path: "/search", element: <Search /> },
  { path: "/novels/:id/:novelSlug", element: <Novel /> },
  { path: "/login", element: <Login />},
  { path: "/register", element: <Register /> },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  </StrictMode>,
)
