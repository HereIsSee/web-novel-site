import { httpRequest } from "./http";

export const uploadCoverTemp = (formData) =>
  httpRequest("/api/upload/cover-temp", {
    method: "POST",
    body: formData,
    isFormData: true,
  });

export const createNovel = (data) =>
  httpRequest("/api/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
