import { httpRequest } from "./http";

export const getOrderByOptions = () => httpRequest("/api/search/order-by");

export const basicSearch = (formData) =>
  httpRequest("/api/search/basic", {
    method: "POST",
    body: JSON.stringify(formData),
  });

export const advancedSearch = (formData) =>
  httpRequest("/api/search/advanced", {
    method: "POST",
    body: JSON.stringify(formData),
  });
