import { httpRequest } from "./http";

export const getNovels = () => httpRequest("/api/novels");

export const getNovel = (id) => httpRequest(`/api/novels/${id}`);

export const getUserNovels = (userId) =>
  httpRequest(`/api/novels/user/${userId}`);

export const uploadCoverTemp = (formData) =>
  httpRequest("/api/upload/cover-temp", {
    method: "POST",
    body: formData,
    isFormData: true,
  });

export const createNovel = (data) =>
  httpRequest("/api/novels/", {
    method: "POST",
    body: JSON.stringify(data),
  });
