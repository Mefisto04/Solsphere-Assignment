import clsx from "clsx";
import type { HealthStatus } from "../utils/status";

export default function StatusBadge({ status }: { status: HealthStatus }) {
  const config = {
    ok: {
      bg: "bg-green-500/20",
      text: "text-green-400",
      border: "border-green-500/30",
      icon: (
        <svg
          className="w-3 h-3 mr-1.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
    },
    issue: {
      bg: "bg-red-500/20",
      text: "text-red-400",
      border: "border-red-500/30",
      icon: (
        <svg
          className="w-3 h-3 mr-1.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      ),
    },
    unknown: {
      bg: "bg-slate-500/20",
      text: "text-slate-400",
      border: "border-slate-500/30",
      icon: (
        <svg
          className="w-3 h-3 mr-1.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  };

  const { bg, text, border, icon } = config[status];
  const label = { ok: "Healthy", issue: "Issues", unknown: "Unknown" }[status];

  return (
    <span
      className={clsx(
        "inline-flex items-center px-3 py-1.5 rounded-full border text-xs font-medium",
        bg,
        text,
        border
      )}
    >
      {icon}
      {label}
    </span>
  );
}
