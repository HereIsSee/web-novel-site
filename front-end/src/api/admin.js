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

export const getComments = (search, page = 1, pageSize = 20) => {
  const query = new URLSearchParams({
    search: search || "",
    page,
    pageSize,
  });

  return httpRequest(`/api/admin/comments?${query.toString()}`);
};
export const deleteComment = (commentId) =>
  httpRequest(`/api/admin/comments/${commentId}`, {
    method: "DELETE",
  });

export const getReviews = (search, page = 1, pageSize = 20) => {
  const query = new URLSearchParams({
    search: search || "",
    page,
    pageSize,
  });

  return httpRequest(`/api/admin/reviews?${query.toString()}`);
};
export const deleteReview = (userId, novelId) =>
  httpRequest(`/api/admin/reviews/${userId}/${novelId}`, {
    method: "DELETE",
  });

export const getNovels = (search, page = 1, pageSize = 20) => {
  const query = new URLSearchParams({
    search: search || "",
    page,
    pageSize,
  });

  return httpRequest(`/api/admin/novels?${query.toString()}`);
};
export const deleteNovelAdmin = (novelId) =>
  httpRequest(`/api/admin/novels/${novelId}`, {
    method: "DELETE",
  });
export const updateNovelAdmin = (novelId, data) =>
  httpRequest(`/api/admin/novels/${novelId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const updateChapterAdmin = (chapterId, data) =>
  httpRequest(`/api/admin/chapters/${chapterId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
export const deleteChapterAdmin = (chapterId) =>
  httpRequest(`/api/admin/chapters/${chapterId}`, {
    method: "DELETE",
  });
