type ApiRequestOptions<TMock> = Omit<RequestInit, "body"> & {
  mockResponse?: TMock | (() => TMock | Promise<TMock>);
  mockDelay?: number;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function resolveMock<T>(options?: ApiRequestOptions<T>) {
  if (!options?.mockResponse) {
    throw new Error("Mock response is not configured for this request.");
  }

  await wait(options.mockDelay ?? 420);
  return typeof options.mockResponse === "function"
    ? await (options.mockResponse as () => T | Promise<T>)()
    : options.mockResponse;
}

async function request<TResponse, TBody = unknown>(
  endpoint: string,
  options: ApiRequestOptions<TResponse> & { body?: TBody } = {}
) {
  const { mockResponse, mockDelay, body, headers, ...init } = options;

  if (!API_BASE_URL) {
    return resolveMock<TResponse>({ mockResponse, mockDelay });
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed." }));
    throw new Error(error.message ?? "Request failed.");
  }

  return response.json() as Promise<TResponse>;
}

export const api = {
  get: <TResponse>(endpoint: string, options?: ApiRequestOptions<TResponse>) =>
    request<TResponse>(endpoint, { ...options, method: "GET" }),
  post: <TResponse, TBody>(endpoint: string, body?: TBody, options?: ApiRequestOptions<TResponse>) =>
    request<TResponse, TBody>(endpoint, { ...options, method: "POST", body })
};
