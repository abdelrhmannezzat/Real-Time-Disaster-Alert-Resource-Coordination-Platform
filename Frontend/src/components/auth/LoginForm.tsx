import type { FormEvent } from "react";
import { LogIn, RefreshCw } from "lucide-react";
import Button from "../common/Button";
import Card from "../common/Card";
import Input from "../common/Input";

interface LoginFormProps {
  email: string;
  password: string;
  loading?: boolean;
  error?: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onSwitchMode: () => void;
}

export default function LoginForm({
  email,
  password,
  loading = false,
  error = "",
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onSwitchMode,
}: LoginFormProps) {
  return (
    <Card title="Login" icon={LogIn}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          autoComplete="email"
          placeholder="name@example.com"
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          autoComplete="current-password"
          placeholder="••••••••"
        />

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
            {error}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? <RefreshCw size={16} className="animate-spin" /> : <LogIn size={16} />}
            {loading ? "Logging in..." : "Login"}
          </Button>

          <Button type="button" variant="outline" onClick={onSwitchMode}>
            Need an account?
          </Button>
        </div>
      </form>
    </Card>
  );
}