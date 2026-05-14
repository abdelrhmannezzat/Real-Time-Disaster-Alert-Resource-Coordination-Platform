import type { SelectHTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/classNames";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  helperText?: ReactNode;
}

export default function Select({ label, helperText, className = "", children, ...props }: SelectProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
      <select
        {...props}
        className={cx(
          "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition",
          "focus:border-sky-500 focus:ring-4 focus:ring-sky-100",
          "dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-sky-950",
          className
        )}
      >
        {children}
      </select>
      {helperText ? <div className="text-xs text-slate-500 dark:text-slate-400">{helperText}</div> : null}
    </label>
  );
}