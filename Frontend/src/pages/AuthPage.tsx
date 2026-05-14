import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/layout/PageShell";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import type { UserRole } from "../types/auth";
import { useAuth } from "../hooks/useAuth";

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerRole, setRegisterRole] = useState<UserRole>("volunteer");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await login({
        email: loginEmail,
        password: loginPassword,
      });

      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await register({
        email: registerEmail,
        password: registerPassword,
        role: registerRole,
      });

      setMessage(`Account created for ${response.email}. Activate it from the admin page if needed.`);
      setMode("login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      title="Authentication"
      subtitle="Register a user, login, then use the protected disaster and admin endpoints."
    >
      {message ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          {message}
        </div>
      ) : null}

      {mode === "login" ? (
        <LoginForm
          email={loginEmail}
          password={loginPassword}
          loading={loading}
          error={error}
          onEmailChange={setLoginEmail}
          onPasswordChange={setLoginPassword}
          onSubmit={handleLogin}
          onSwitchMode={() => setMode("register")}
        />
      ) : (
        <RegisterForm
          email={registerEmail}
          password={registerPassword}
          role={registerRole}
          loading={loading}
          error={error}
          onEmailChange={setRegisterEmail}
          onPasswordChange={setRegisterPassword}
          onRoleChange={setRegisterRole}
          onSubmit={handleRegister}
          onSwitchMode={() => setMode("login")}
        />
      )}
    </PageShell>
  );
}