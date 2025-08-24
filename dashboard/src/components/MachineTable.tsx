import { useState } from "react";
import type { Machine } from "../types/api";
import { fmtLastSeen } from "../utils/format";
import StatusBadge from "./StatusBadge";
import { computeHealth } from "../utils/status";
import { Icons } from "./icons";

export default function MachineTable({ items }: { items: Machine[] }) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = () => {
    setIsExporting(true);
    const headers = ["Machine", "Platform", "Status", "Last Seen"].join(",");
    const rows = items.map((m) =>
      [m.hostname, m.platform, computeHealth(m), fmtLastSeen(m.lastSeen)].join(
        ","
      )
    );

    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "machines.csv";
    link.click();

    setIsExporting(false);
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Machine Status Overview
        </h3>
        <button
          onClick={exportToCSV}
          disabled={isExporting || items.length === 0}
          className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white rounded-xl transition-all duration-200 hover:shadow-lg disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <Icons.Spinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
          ) : (
            <Icons.Export className="w-4 h-4 mr-2" />
          )}
          {isExporting ? "Exporting..." : `Export CSV (${items.length})`}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-700/30">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Machine
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Platform
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Security Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Health
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Last Activity
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {items.map((m) => {
              const r = m.latestReport;
              const health = computeHealth(m);

              const disk = r?.disk_encryption?.status ?? "unknown";
              const upd = r?.os_updates?.status ?? "unknown";
              const av = r?.antivirus?.status ?? "unknown";
              const slp =
                typeof r?.sleep_settings?.compliant === "boolean"
                  ? r.sleep_settings.compliant
                    ? "≤10m"
                    : ">10m/never"
                  : "unknown";

              return (
                <tr
                  key={m._id}
                  className="hover:bg-slate-700/20 transition-colors duration-150"
                >
                  {/* Machine Info */}
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-white">
                        {m.hostname}
                      </div>
                      <div className="text-xs text-slate-400">
                        ID: {m.machineId}
                      </div>
                    </div>
                  </td>

                  {/* Platform */}
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          m.platform === "windows"
                            ? "bg-blue-400"
                            : m.platform === "linux"
                            ? "bg-green-400"
                            : m.platform === "darwin"
                            ? "bg-purple-400"
                            : "bg-slate-400"
                        }`}
                      ></div>
                      <span className="text-sm text-slate-300 capitalize">
                        {m.platform}
                      </span>
                    </div>
                  </td>

                  {/* Security Status */}
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            disk === "encrypted" ? "bg-green-400" : "bg-red-400"
                          }`}
                        ></div>
                        <span className="text-xs text-slate-300">
                          Disk: {disk}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            upd === "up_to_date"
                              ? "bg-green-400"
                              : "bg-yellow-400"
                          }`}
                        ></div>
                        <span className="text-xs text-slate-300">
                          Updates: {upd}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            av === "found" ? "bg-green-400" : "bg-red-400"
                          }`}
                        ></div>
                        <span className="text-xs text-slate-300">AV: {av}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            slp === "≤10m" ? "bg-green-400" : "bg-yellow-400"
                          }`}
                        ></div>
                        <span className="text-xs text-slate-300">
                          Sleep: {slp}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={health} />
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-300">
                      {fmtLastSeen(m.lastSeen)}
                    </div>
                    {r?.timestamp && (
                      <div className="text-xs text-slate-500">
                        Report: {new Date(r.timestamp).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!items.length && (
        <div className="text-center py-12">
          <Icons.EmptyState className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-slate-300">
            No machines found
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Get started by adding your first machine.
          </p>
        </div>
      )}
    </div>
  );
}
