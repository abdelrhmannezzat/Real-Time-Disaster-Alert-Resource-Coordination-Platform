import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/layout/Header";
import DashboardPage from "./pages/DashboardPage";
import AuthPage from "./pages/AuthPage";
import CreateDisasterPage from "./pages/CreateDisasterPage";
import AdminPage from "./pages/AdminPage";
import LiveAlertsPage from "./pages/LiveAlertsPage";
import NotFoundPage from "./pages/NotFoundPage";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Header theme={theme} setTheme={setTheme} />

      <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route
            path="/auth"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />}
          />
          <Route path="/create" element={<CreateDisasterPage />} />
          <Route
            path="/admin"
            element={
              user?.role === "admin" ? (
                <AdminPage />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route path="/live" element={<LiveAlertsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}