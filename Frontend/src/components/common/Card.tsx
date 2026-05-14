import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cx } from "../../utils/classNames";

interface CardProps {
  title: string;
  icon?: LucideIcon;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function Card({ title, icon: Icon, action, children, className = "" }: CardProps) {
  return (
    <div
      className={cx(
        "rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950",
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {Icon ? (
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
              <Icon size={20} />
            </div>
          ) : null}
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>
          </div>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}