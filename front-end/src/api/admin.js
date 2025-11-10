import { httpRequest } from "./http";

export const getUsers = (
  search,
  page = 1,
  pageSize = 20,
  includeDeleted = false,
) => {
  const query = new URLSearchParams({
    search: search || "",
    page,
    pageSize,
    includeDeleted,
  });

  return httpRequest(`/api/admin/users?${query.toString()}`);
};

export const deleteUser = (userId) =>
  httpRequest(`/api/admin/users/${userId}`, {
    method: "DELETE",
  });

export const getComments = (chapterId) =>
  httpRequest(`/api/comments/chapter/${chapterId}`);

export const getReviews = (chapterId) =>
  httpRequest(`/api/comments/chapter/${chapterId}`);

export const getNovels = (chapterId) =>
  httpRequest(`/api/comments/chapter/${chapterId}`);

export const getChapters = (chapterId) =>
  httpRequest(`/api/comments/chapter/${chapterId}`);

export const deleteComment = (commentId) =>
  httpRequest(`/api/comments/${commentId}`, {
    method: "DELETE",
  });
