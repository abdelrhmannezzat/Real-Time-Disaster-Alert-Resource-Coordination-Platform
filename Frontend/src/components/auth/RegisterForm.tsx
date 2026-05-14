import type { FormEvent } from "react";
import { UserPlus, RefreshCw } from "lucide-react";
import Button from "../common/Button";
import Card from "../common/Card";
import Input from "../common/Input";
import Select from "../common/Select";
import type { UserRole } from "../../types/auth";

interface RegisterFormProps {
  email: string;
  password: string;
  role: UserRole;
  loading?: boolean;
  error?: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onRoleChange: (value: UserRole) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onSwitchMode: () => void;
}

export default function RegisterForm({
  email,
  password,
  role,
  loading = false,
  error = "",
  onEmailChange,
  onPasswordChange,
  onRoleChange,
  onSubmit,
  onSwitchMode,
}: RegisterFormProps) {
  return (
    <Card title="Register" icon={UserPlus}>
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
          autoComplete="new-password"
          placeholder="••••••••"
        />
        <Select label="Role" value={role} onChange={(e) => onRoleChange(e.target.value as UserRole)}>
          <option value="volunteer">Volunteer</option>
          <option value="coordinator">Coordinator</option>
          <option value="admin">Admin</option>
        </Select>

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
            {error}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? <RefreshCw size={16} className="animate-spin" /> : <UserPlus size={16} />}
            {loading ? "Creating account..." : "Register"}
          </Button>

          <Button type="button" variant="outline" onClick={onSwitchMode}>
            Already have an account?
          </Button>
        </div>
      </form>
    </Card>
  );
}