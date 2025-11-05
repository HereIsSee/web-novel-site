import { httpRequest } from "./http";

// Public novel routes
export const getPublicNovels = () => httpRequest("/api/public-novels");

export const getPublicNovel = (id) => httpRequest(`/api/public-novels/${id}`);

export const getTopNovels = (count = 5, status) => {
  let url = `/api/public-novels/top?count=${count}`;
  if (status) url += `&status=${status}`;
  return httpRequest(url);
};

export const getLatestNovels = (count = 5) => {
  return httpRequest(`/api/public-novels/latest?count=${count}`);
};

// Get novel status values
export const getNovelStatusValues = () => httpRequest("/api/novels/statuses");

// Old routes that may be recategorized
export const getNovels = () => httpRequest("/api/novels");

export const getNovel = (id) => httpRequest(`/api/novels/${id}`);

export const getUserNovels = (userId) =>
  httpRequest(`/api/novels/user/${userId}`);

export const getUserFollowedNovels = (userId) =>
  httpRequest(`/api/novels/user/${userId}/follows`);

export const getUserFavoritedNovels = (userId) =>
  httpRequest(`/api/novels/user/${userId}/favorites`);

export const getUserReadLaterNovels = (userId) =>
  httpRequest(`/api/novels/user/${userId}/readlater`);

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

export const updateNovel = (id, data) =>
  httpRequest(`/api/novels/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
export const deleteNovel = (id) =>
  httpRequest(`/api/novels/${id}`, {
    method: "DELETE",
  });
