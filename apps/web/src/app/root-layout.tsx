import { cn } from "@unfoldresearch/ui";
import { Link, NavLink, Outlet } from "react-router";

const navItems = [
  { to: "/playground", label: "Playground" },
  { to: "/users", label: "Users" },
];

export function RootLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-10 border-b border-border bg-surface/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-6 px-6">
          <Link to="/" className="flex items-center gap-2">
            <img src="/favicon.png" alt="" className="size-7" />
            <span className="font-display font-semibold">Unfold Research</span>
          </Link>
          <nav className="flex gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) =>
                  cn(
                    "rounded-control px-3 py-1.5 text-sm font-medium text-fg-muted transition-colors hover:text-fg",
                    isActive && "bg-neutral-subtle text-fg",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}
