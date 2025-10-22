import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";

import AuthorDashboard from "./routes/AuthorDashboard";
import CreateNovel from "./routes/CreateNovel";
import Favorites from "./routes/Favorites";
import Follows from "./routes/Follows";
import Home from "./routes/Home";
import Novel from "./routes/Novel";
import Profile from "./routes/Profile";
import ReadLater from "./routes/ReadLater";
import Search from "./routes/Search";
import Login from "./routes/Login";
import Register from "./routes/Register";
import Chapter from "./routes/Chapter";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/author-dashboard/:id", element: <AuthorDashboard /> },
  { path: "/author-dashboard/:id/create-novel", element: <CreateNovel /> },
  { path: "/favorites", element: <Favorites /> },
  { path: "/follows", element: <Follows /> },
  { path: "/read-later", element: <ReadLater /> },
  { path: "/profile/:id", element: <Profile /> },
  { path: "/search", element: <Search /> },
  { path: "/novels/:id/:novelSlug", element: <Novel /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/novels/:id/:novelSlug/chapters/:id/:chapterSlug",
    element: <Chapter />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ToastProvider>
  </StrictMode>,
);
