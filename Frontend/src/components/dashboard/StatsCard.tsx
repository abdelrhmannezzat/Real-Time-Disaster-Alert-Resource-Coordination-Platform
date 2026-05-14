import type { LucideIcon } from "lucide-react";
import Card from "../common/Card";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
}

export default function StatsCard({ title, value, subtitle, icon }: StatsCardProps) {
  return (
    <Card title={title} icon={icon}>
      <div className="text-3xl font-black text-slate-900 dark:text-white">{value}</div>
      {subtitle ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
    </Card>
  );
}