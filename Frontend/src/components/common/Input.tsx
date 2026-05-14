import type { InputHTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/classNames";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: ReactNode;
}

export default function Input({ label, helperText, className = "", ...props }: InputProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
      <input
        {...props}
        className={cx(
          "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition",
          "placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100",
          "dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-sky-950",
          className
        )}
      />
      {helperText ? <div className="text-xs text-slate-500 dark:text-slate-400">{helperText}</div> : null}
    </label>
  );
}