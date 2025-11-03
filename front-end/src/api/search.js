import { httpRequest } from "./http";

export const getOrderByOptions = () => httpRequest("/api/search/order-by");
