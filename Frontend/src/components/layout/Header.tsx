import { Link, NavLink } from "react-router-dom";
import { Bell, LogOut, Moon, ShieldAlert, Sun, Sparkles, Users, LogIn } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useWebSocket } from "../../hooks/useWebSocket";
import Badge from "../common/Badge";
import Button from "../common/Button";
import { cx } from "../../utils/classNames";
import { formatEnumLabel, socketStateBadgeClass } from "../../utils/format";

interface HeaderProps {
  theme: "light" | "dark";
  setTheme: React.Dispatch<React.SetStateAction<"light" | "dark">>;
}

const links = [
  { to: "/dashboard", label: "Dashboard", icon: ShieldAlert },
  { to: "/auth", label: "Login", icon: LogIn },
  { to: "/create", label: "Create Disaster", icon: Sparkles },
  { to: "/admin", label: "Admin", icon: Users },
  { to: "/live", label: "Live Alerts", icon: Bell },
];

export default function Header({ theme, setTheme }: HeaderProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const { socketState, alerts, disconnect } = useWebSocket();
  const visibleLinks = links.filter((link) => {
    // Hide Auth page when logged in
    if (link.to === "/auth" && isAuthenticated) {
      return false;
    }

    // Hide Admin page for non-admin users
    if (link.to === "/admin" && user?.role !== "admin") {
      return false;
    }

    return true;
  });

  const handleLogout = () => {
    disconnect();
    logout();
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
              <ShieldAlert size={22} />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 dark:text-white md:text-xl">
                Disaster Platform
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Real-time disaster coordination
              </p>
            </div>
          </Link>

          <nav className="flex flex-wrap gap-2">
            {visibleLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cx(
                    "inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                    isActive
                      ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  )
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            <Badge className={socketStateBadgeClass(socketState)}>{socketState}</Badge>
            <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Alerts {alerts.length}
            </Badge>

            {isAuthenticated && user ? (
              <Badge className="bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                {user.email} · {formatEnumLabel(user.role)}
              </Badge>
            ) : (
              <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Guest
              </Badge>
            )}

            <Button variant="ghost" onClick={() => setTheme(prev => prev === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              {theme === "dark" ? "Light" : "Dark"}
            </Button>

            {isAuthenticated ? (
              <Button variant="outline" onClick={handleLogout}>
                <LogOut size={16} />
                Logout
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}