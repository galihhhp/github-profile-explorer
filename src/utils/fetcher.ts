export interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
  timeout?: number;
}

const createFetcherError = (
  message: string,
  status?: number
): {
  name: string;
  message: string;
  status?: number;
} => ({
  name: "FetcherError",
  message,
  status,
});

const validateGitHubToken = (token?: string): string => {
  if (!token) {
    throw createFetcherError(
      "GitHub API token is required."
    );
  }

  return token;
};

const validateUrl = (url: string): void => {
  if (!url || typeof url !== "string") {
    throw createFetcherError("URL must be a non-empty string");
  }

  if (!/^https?:\/\//.test(url)) {
    throw createFetcherError("URL must start with http:// or https://");
  }
};

const DEFAULT_TIMEOUT = 10000;
const DEFAULT_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

//
export async function fetcher<TResponse>(
  url: string,
  options: FetchOptions = {}
): Promise<TResponse> {
  try {
    validateUrl(url);

    const token = import.meta.env.VITE_GITHUB_TOKEN;
    validateGitHubToken(token);

    options.headers = {
      ...options.headers,
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
    };

    if (options.headers && typeof options.headers !== "object") {
      throw createFetcherError("Headers must be an object");
    }

    if (options.body && typeof options.body !== "object") {
      throw createFetcherError("Body must be an object");
    }

    const headers = {
      ...DEFAULT_HEADERS,
      ...options.headers,
    };

    const fetchOptions: RequestInit = {
      method: options.method || "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      credentials: "same-origin",
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      options.timeout || DEFAULT_TIMEOUT
    );

    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.text();
      const error = createFetcherError(
        `Failed to fetch GitHub data. Status: ${response.status}, Message: ${errorBody}`,
        response.status
      );

      throw error;
    }

    return await response.json();
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "FetcherError"
    ) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      const timeoutError = createFetcherError("Request timed out", 408);
      throw timeoutError;
    }

    const genericError = createFetcherError(
      error instanceof Error
        ? `Failed to fetch GitHub user data: ${error.message}`
        : "Failed to fetch GitHub user data"
    );

    throw genericError;
  }
}
