import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@unfoldresearch/ui";

import { useUsers } from "../features/users/use-users";

export function UsersPage() {
  const { data: users, error, isLoading, mutate } = useUsers();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Users
        </h1>
        <p className="text-fg-muted">
          Fetched with SWR and validated with zod.
        </p>
      </div>

      {isLoading && <p className="text-sm text-fg-subtle">Loading…</p>}

      {error && (
        <Card elevated={false} className="border-danger">
          <CardHeader>
            <CardTitle>Couldn't load users</CardTitle>
            <CardDescription>{error.message}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button tone="danger" variant="soft" onClick={() => void mutate()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {users && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <Card key={user.id}>
              <CardHeader>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Badge>@{user.username}</Badge>
                <Badge tone="accent">{user.company.name}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
