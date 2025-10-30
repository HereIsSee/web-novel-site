import { httpRequest } from "./http";

export const getNovelChapters = (novelId) =>
  httpRequest(`/api/novels/${novelId}/chapters`);

export const getChapter = (novelId, chapterId) =>
  httpRequest(`/api/novels/${novelId}/chapters/${chapterId}`);

export const createChapter = (novelId, data) =>
  httpRequest(`/api/novels/${novelId}/chapters`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateChapter = (novelId, chapterId, data) =>
  httpRequest(`/api/novels/${novelId}/chapters/${chapterId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
