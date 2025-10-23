import { httpRequest } from "./http";

export const getTags = () => httpRequest("/api/tags");
