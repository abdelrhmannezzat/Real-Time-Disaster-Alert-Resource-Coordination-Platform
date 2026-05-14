import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PageShell from "../components/layout/PageShell";

export default function NotFoundPage() {
  return (
    <PageShell title="Page not found" subtitle="The page you requested does not exist.">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-950"
      >
        <ArrowLeft size={16} />
        Go back home
      </Link>
    </PageShell>
  );
}