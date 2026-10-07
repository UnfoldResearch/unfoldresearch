import type { z } from "zod";

export class HttpError extends Error {
  readonly status: number;
  readonly url: string;

  constructor(status: number, url: string) {
    super(`Request to ${url} failed with ${status}`);
    this.name = "HttpError";
    this.status = status;
    this.url = url;
  }
}

/** Fetch JSON and validate it against a zod schema. Throws on HTTP or validation errors. */
export async function fetchJson<Schema extends z.ZodType>(
  url: string,
  schema: Schema,
  init?: RequestInit,
): Promise<z.output<Schema>> {
  const response = await fetch(url, {
    ...init,
    headers: { Accept: "application/json", ...init?.headers },
  });
  if (!response.ok) throw new HttpError(response.status, url);
  return schema.parse(await response.json());
}
