import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Bell,
  BookOpenText,
  ChevronDown,
  CircleHelp,
  FilePlus,
  History,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
} from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";

import { BayanLogo } from "@/components/bayan-logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "New assessment", to: "/assessment/new", icon: FilePlus },
  { label: "Application history", to: "/history", icon: History },
  { label: "Reports & audits", to: "/reports", icon: BarChart3 },
  { label: "Shariah Council", to: "/shariah-council", icon: BookOpenText },
  { label: "Settings", to: "/settings", icon: Settings },
  { label: "Help & support", to: "/help-support", icon: CircleHelp },
] as const;

function getPageTitle(pathname: string) {
  if (pathname.startsWith("/assessment/") && pathname.endsWith("/result")) return "Assessment result";
  if (pathname.startsWith("/assessment/") && pathname.endsWith("/alternative")) {
    return "Alternative Shariah-compliant products";
  }

  const exactMatch = {
    "/dashboard": "Application queue",
    "/assessment/new": "New credit assessment",
    "/assessment/processing": "Running BAYAN assessment",
    "/history": "Application history",
    "/reports": "Reports & audits",
    "/settings": "Settings",
    "/shariah-council": "Shariah Council",
    "/help-support": "Help & support",
  } as const;

  return exactMatch[pathname as keyof typeof exactMatch] ?? "BAYAN";
}

function SidebarNav({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="px-7 pb-8 pt-8">
        <BayanLogo inverse className="items-start" showTagline compact />
      </div>
      <nav className="flex-1 space-y-1 px-3" aria-label="Primary navigation">
        {navItems.map(({ label, to, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            activeProps={{
              className: "border-l-2 border-bayan-gold-warm bg-sidebar-accent text-sidebar-foreground",
            }}
            inactiveProps={{ className: "border-l-2 border-transparent text-sidebar-foreground/90" }}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-r-md px-4 py-3 text-sm font-medium transition-colors hover:bg-sidebar-accent",
              mobile && "rounded-md border-l-0",
            )}
          >
            <Icon className="size-4" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
      <div className="sidebar-bank-divider mx-7 mt-6 pt-6">
        <div className="rounded-lg border border-white/12 px-4 py-4 text-center text-sidebar-foreground/90">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-lg">
            MB
          </div>
          <p className="text-sm font-medium">Maybank Islamic</p>
          <p className="mt-2 text-xs text-bayan-gold-warm">Powered by BAYAN</p>
        </div>
      </div>
    </div>
  );
}

export function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pageTitle = useMemo(() => getPageTitle(location.pathname), [location.pathname]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login", replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="page-shell min-h-dvh bg-bayan-cream">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 lg:block">
        <SidebarNav />
      </aside>

      <header className="fixed inset-x-0 top-0 z-20 h-16 border-b bg-card/96 backdrop-blur-sm lg:left-60">
        <div className="flex h-full items-center justify-between gap-4 px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open navigation menu">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[18rem] border-r bg-sidebar p-0 text-sidebar-foreground">
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation</SheetTitle>
                  <SheetDescription>Navigate across BAYAN screens</SheetDescription>
                </SheetHeader>
                <SidebarNav mobile onNavigate={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>
            <div className="hidden lg:block">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">BAYAN</p>
              <p className="text-sm font-medium leading-tight text-bayan-green-deep">{pageTitle}</p>
            </div>
          </div>

          <div className="hidden flex-1 justify-center md:flex">
            <label className="relative w-full max-w-[300px]">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                aria-label="Search applicant ID or name"
                placeholder="Search applicant ID or name..."
                className="h-10 rounded-md border-border bg-card pl-9"
              />
            </label>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Notifications"
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card transition-colors hover:bg-accent"
            >
              <Bell className="size-4 text-bayan-green-deep" />
              <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-danger" aria-hidden="true" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-3 rounded-md border border-border bg-card px-2 py-1.5 transition-colors hover:bg-accent"
                  aria-label="Open profile menu"
                >
                  <Avatar className="h-10 w-10 border border-bayan-green-deep/20">
                    <AvatarFallback className="bg-bayan-green-deep text-primary-foreground">
                      {user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden text-left md:block">
                    <p className="text-sm font-semibold text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.role}</p>
                  </div>
                  <ChevronDown className="size-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onSelect={() => navigate({ to: "/settings" })}>Profile</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => {
                    logout();
                    navigate({ to: "/login", replace: true });
                  }}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main id="main-content" className="min-h-dvh px-4 pb-10 pt-24 lg:ml-60 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
