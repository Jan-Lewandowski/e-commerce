export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? "";

type RequestOptions = Omit<RequestInit, "body"> & {
  query?: Record<string, string | number | boolean | null | undefined>;
  body?: unknown;
};

function buildUrl(path: string, query?: RequestOptions["query"]) {
  const normalized = path.startsWith("/") ? path : `/${path}`;

  if (API_BASE_URL) {
    const url = new URL(`${API_BASE_URL}${normalized}`);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value === undefined || value === null || value === "") continue;
        url.searchParams.set(key, String(value));
      }
    }
    return url.toString();
  }

  if (!query) {
    return normalized;
  }

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue;
    params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `${normalized}?${qs}` : normalized;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { query, body, headers, ...rest } = options;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const init: RequestInit = {
    credentials: "include",
    ...rest,
    headers: {
      Accept: "application/json",
      ...(!isFormData && body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body !== undefined ? (isFormData ? body : JSON.stringify(body)) : undefined,
  };

  const response = await fetch(buildUrl(path, query), init);

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  const parsed = text ? safeJson(text) : null;

  if (!response.ok) {
    const message =
      (parsed && typeof parsed === "object"
        ? String((parsed as { message?: unknown }).message ?? "")
        : "") || `HTTP ${response.status}`;
    throw new Error(message);
  }

  return parsed as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
