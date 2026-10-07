import { z } from "zod";

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  email: z.email(),
  company: z.object({ name: z.string() }),
});

export const usersSchema = z.array(userSchema);

export type User = z.infer<typeof userSchema>;
