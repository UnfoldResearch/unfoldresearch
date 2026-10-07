import { Button } from "@unfoldresearch/ui";
import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <h1 className="font-display text-2xl font-semibold">Page not found</h1>
      <Button render={<Link to="/" />} nativeButton={false} variant="soft">
        Back to playground
      </Button>
    </div>
  );
}
