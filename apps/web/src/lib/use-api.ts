import useSWR, { type SWRConfiguration } from "swr";
import type { z } from "zod";

import { fetchJson } from "./fetcher";

/**
 * Typed SWR hook: the response is validated by `schema` and the data is inferred from it.
 * Pass `null` as the key to skip fetching (conditional requests).
 */
export function useApi<Schema extends z.ZodType>(
  url: string | null,
  schema: Schema,
  config?: SWRConfiguration<z.output<Schema>, Error>,
) {
  return useSWR<z.output<Schema>, Error>(
    url,
    (key: string) => fetchJson(key, schema),
    config,
  );
}
