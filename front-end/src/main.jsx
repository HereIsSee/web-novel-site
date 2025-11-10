import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";

import AuthorDashboard from "./routes/AuthorDashboard";
import AuthorNovel from "./routes/AuthorNovel";
import NovelForm from "./routes/NovelForm";
import ChapterForm from "./routes/ChapterForm";
import Favorites from "./routes/Favorites";
import Follows from "./routes/Follows";
import Home from "./routes/Home";
import Novel from "./routes/Novel";
import Profile from "./routes/Profile";
import ReadLater from "./routes/ReadLater";
import Search from "./routes/Search";
import Login from "./routes/Login";
import Register from "./routes/Register";
import NovelReaderLayout from "./routes/NovelReaderLayout";
import Chapter from "./routes/Chapter";
import AdminDashboard from "./routes/Admin/AdminDashboard";
import AdminUsers from "./routes/Admin/AdminUsers";
import AdminComments from "./routes/Admin/AdminComments";
import AdminReviews from "./routes/Admin/AdminReviews";
import AdminNovels from "./routes/Admin/AdminNovels";
import AdminChapters from "./routes/Admin/AdminChapters";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/author-dashboard/:id", element: <AuthorDashboard /> },
  {
    path: "/admin-dashboard/",
    element: <AdminDashboard />,
    children: [
      {
        path: "users",
        element: <AdminUsers />,
      },
      {
        path: "comments",
        element: <AdminComments />,
      },
      {
        path: "reviews",
        element: <AdminReviews />,
      },
      {
        path: "novels",
        element: <AdminNovels />,
      },
      {
        path: "chapters",
        element: <AdminChapters />,
      },
    ],
  },
  { path: "/author-dashboard/:id/create-novel", element: <NovelForm /> },
  {
    path: "/author-dashboard/:userId/novel/:novelId",
    element: <AuthorNovel />,
  },
  {
    path: "/author-dashboard/:userId/novel/:novelId/edit",
    element: <NovelForm />,
  },
  { path: "/favorites", element: <Favorites /> },
  { path: "/follows", element: <Follows /> },
  { path: "/read-later", element: <ReadLater /> },
  { path: "/profile/:id", element: <Profile /> },
  { path: "/search", element: <Search /> },
  { path: "/novels/:id/:novelSlug", element: <Novel /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/novels/:novelId/:novelSlug/read",
    element: <NovelReaderLayout />,
    children: [
      {
        path: "chapters/:chapterId/:chapterSlug",
        element: <Chapter />,
      },
    ],
  },
  {
    path: "/author-dashboard/:userId/novel/:novelId/chapters/create-chapter",
    element: <ChapterForm />,
  },
  {
    path: "/author-dashboard/:userId/novel/:novelId/chapters/:chapterId/edit",
    element: <ChapterForm />,
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
