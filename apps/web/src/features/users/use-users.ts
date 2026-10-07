import { useApi } from "../../lib/use-api";
import { usersSchema } from "./schema";

// Demo endpoint; point at your API (or a Vite proxy) when you have one.
const USERS_URL = "https://jsonplaceholder.typicode.com/users";

export function useUsers() {
  return useApi(USERS_URL, usersSchema);
}
