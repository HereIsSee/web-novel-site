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

  const response = await fetch(url, config);

  // if (response.status === 401) {
  //   // Token expired or invalid
  //   localStorage.removeItem("token");
  //   window.location.href = "/login";
  //   throw new Error("Unauthorized, please log in again.");
  // }

  if (!response.ok) {
    let errorMessage;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || JSON.stringify(errorData);
    } catch {
      errorMessage = await response.text().catch(() => "Unknown error");
    }

    throw new Error(errorMessage);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }
  return null;
}
