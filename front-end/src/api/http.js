const API_URL = import.meta.env.VITE_API_URL;

export async function httpRequest(url, options = {}) {
  const token = localStorage.getItem("token");

  const defaultHeaders = {};

  if (!options.isFormData) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  };

  const fullUrl = `${API_URL}${url}`;

  let response = await fetch(fullUrl, config);

  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Unauthorized, please log in again.");
  }

  if (!response.ok) {
    let errorMessage;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || JSON.stringify(errorData);
    } catch {
      errorMessage = await response.text().catch(() => "Unknown error");
    }

    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }
  return null;
}
