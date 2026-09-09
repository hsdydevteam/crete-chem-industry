export async function api<T = Record<string, unknown>>(
  path: string,
  method = "GET",
  data?: unknown,
): Promise<T> {
  const response = await fetch(`/api/${path}`, {
    method,
    credentials: "same-origin",
    headers:
      data instanceof FormData
        ? {}
        : data
          ? { "Content-Type": "application/json" }
          : {},
    body:
      data instanceof FormData ? data : data ? JSON.stringify(data) : undefined,
    cache: "no-store",
  });
  const result = await response
    .json()
    .catch(() => ({
      error: "The server could not complete this request. Please try again.",
    }));
  if (!response.ok) throw new Error(result.error || "Request failed.");
  return result;
}
