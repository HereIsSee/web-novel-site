import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";

import AuthorDashboard from "./routes/Author/AuthorDashboard";
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

import NovelManager from "./routes/Author/NovelManager";
import NovelManagerInfo from "./routes/Author/NovelManagerInfo";
import NovelManagerStatistics from "./routes/Author/NovelManagerStatistics";
import NovelManagerChapters from "./routes/Author/NovelManagerChapters";

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
      // {
      //   path: "chapters",
      //   element: <AdminChapters />,
      // },
    ],
  },
  {
    path: "/admin-dashboard/novels/:novelId",
    element: <NovelManager role="admin" />,
    children: [
      {
        path: "novel-info",
        element: <NovelManagerInfo />,
      },
      {
        path: "stats",
        element: <NovelManagerStatistics />,
      },
      {
        path: "chapters",
        element: <NovelManagerChapters />,
      },
    ],
  },
  { path: "/author-dashboard/:id/create-novel", element: <NovelForm /> },
  {
    path: "/author-dashboard/:userId/novel/:novelId",
    element: <NovelManager role="author" />,
    children: [
      {
        path: "novel-info",
        element: <NovelManagerInfo />,
      },
      {
        path: "stats",
        element: <NovelManagerStatistics />,
      },
      {
        path: "chapters",
        element: <NovelManagerChapters />,
      },
    ],
  },
  {
    path: "/admin-dashboard/novel/:novelId/edit",
    element: <NovelForm role="admin" />,
  },
  {
    path: "/author-dashboard/:userId/novel/:novelId/edit",
    element: <NovelForm role="author" />,
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
    path: "/admin-dashboard/novel/:novelId/chapters/:chapterId/edit",
    element: <ChapterForm role="admin" />,
  },
  {
    path: "/author-dashboard/:userId/novel/:novelId/chapters/:chapterId/edit",
    element: <ChapterForm role="author" />,
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
