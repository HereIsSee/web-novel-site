import { httpRequest } from "./http";

export const getChapterComments = (chapterId) =>
  httpRequest(`/api/comments/chapter/${chapterId}`);

export const postComment = (data) =>
  httpRequest(`/api/comments/`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteComment = (commentId) =>
  httpRequest(`/api/comments/${commentId}`, {
    method: "DELETE",
  });
