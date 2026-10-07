import { Button } from "@unfoldresearch/ui";
import { isRouteErrorResponse, Link, useRouteError } from "react-router";

export function RouteError() {
  const error = useRouteError();
  const title = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : "Something went wrong";
  const detail = isRouteErrorResponse(error)
    ? null
    : error instanceof Error
      ? error.message
      : String(error);

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="font-display text-2xl font-semibold">{title}</h1>
      {detail && <p className="text-sm text-fg-muted">{detail}</p>}
      <Button render={<Link to="/" />} nativeButton={false} variant="soft">
        Go home
      </Button>
    </div>
  );
}
