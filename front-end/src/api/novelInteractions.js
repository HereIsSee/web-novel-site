import { httpRequest } from "./http";

export const follow = (novelId) =>
  httpRequest(`/api/novelinteractions/follow/${novelId}`, {
    method: "POST",
  });
export const favorite = (novelId) =>
  httpRequest(`/api/novelinteractions/favorite/${novelId}`, {
    method: "POST",
  });
export const readLater = (novelId) =>
  httpRequest(`/api/novelinteractions/readlater/${novelId}`, {
    method: "POST",
  });

export const unFollow = (novelId) =>
  httpRequest(`/api/novelinteractions/follow/${novelId}`, {
    method: "DELETE",
  });
export const unFavorite = (novelId) =>
  httpRequest(`/api/novelinteractions/favorite/${novelId}`, {
    method: "DELETE",
  });
export const unReadLater = (novelId) =>
  httpRequest(`/api/novelinteractions/readlater/${novelId}`, {
    method: "DELETE",
  });

export const getUserNovelStatus = (novelId) =>
  httpRequest(`/api/novelinteractions/status/${novelId}`);

export const getNovelStats = (novelId) =>
  httpRequest(`/api/novelinteractions/stats/novel/${novelId}`);
