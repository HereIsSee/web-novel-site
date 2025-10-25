import { httpRequest } from "./http";

export const getNovelReviews = (id) => httpRequest(`/api/reviews/novel/${id}`);

export const getUserReviews = (id) => httpRequest(`/api/reviews/user/${id}`);

export const getUserNovelReview = (userId, novelId) =>
  httpRequest(`/api/reviews/novel/${novelId}/user/${userId}`);

export const createReview = (novelId, data) =>
  httpRequest(`/api/reviews/novel/${novelId}`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateReview = (novelId, data) =>
  httpRequest(`/api/reviews/novel/${novelId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
