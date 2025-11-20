const API_URL = import.meta.env.VITE_API_URL;

let accessToken = localStorage.getItem("token");

const setAccessToken = (token) => {
  accessToken = token;
  localStorage.setItem("token", token);
};

async function refreshAccessToken() {
  try {
    const res = await fetch(`${API_URL}/api/auth/refresh`, {
      //On this request it return 401 without a message
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (data.accessToken) {
      setAccessToken(data.accessToken);
      return data.accessToken;
    }

    return null;
  } catch {
    return null;
  }
}

export async function httpRequest(url, options = {}) {
  const defaultHeaders = {};

  if (!options.isFormData) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  if (accessToken) {
    defaultHeaders["Authorization"] = `Bearer ${accessToken}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
    credentials: "include",
  };

  const fullUrl = `${API_URL}${url}`;

  let response = await fetch(fullUrl, config);

  if (response.status === 401) {
    const newToken = await refreshAccessToken();

    if (newToken) {
      // Retry original request with new access token
      config.headers["Authorization"] = `Bearer ${newToken}`;
      response = await fetch(fullUrl, config);
    } else {
      // Refresh failed -> logout
      accessToken = null;
      localStorage.removeItem("token");
      window.location.href = "/login";
      throw new Error("Unauthorized, please log in again.");
    }
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
