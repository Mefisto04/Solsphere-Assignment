import { useFiltersStore } from "../store/filters.store";
import { Icons } from "./icons";

export default function Filters() {
  const { os, status, search, sort, set, reset } = useFiltersStore();

  return (
    <div className="bg-[#0A0C10] backdrop-blur-xl border border-[#1F2937]/30 rounded-lg p-6 shadow-2xl">
      <div className="flex flex-wrap gap-6 items-end">
        <div className="min-w-[140px]">
          <label className="block text-sm font-medium text-gray-200 mb-2 font-inter">
            Operating System
          </label>
          <select
            className="w-full px-4 py-2.5 bg-[#111827] border border-[#374151] rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 font-inter"
            value={os}
            onChange={(e) =>
              set({
                os: e.target.value as "windows" | "linux" | "darwin" | "all",
              })
            }
          >
            <option value="all">All Systems</option>
            <option value="windows">Windows</option>
            <option value="linux">Linux</option>
            <option value="darwin">macOS</option>
          </select>
        </div>

        <div className="min-w-[140px]">
          <label className="block text-sm font-medium text-gray-200 mb-2 font-inter">
            Health Status
          </label>
          <select
            className="w-full px-4 py-2.5 bg-[#111827] border border-[#374151] rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 font-inter"
            value={status}
            onChange={(e) =>
              set({
                status: e.target.value as "ok" | "issue" | "unknown" | "all",
              })
            }
          >
            <option value="all">All Statuses</option>
            <option value="ok">Healthy</option>
            <option value="issue">Issues</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>

        <div className="flex-1 min-w-[250px]">
          <label className="block text-sm font-medium text-gray-200 mb-2 font-inter">
            Search Machines
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icons.Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              className="w-full pl-10 pr-4 py-2.5 bg-[#111827] border border-[#374151] rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 font-inter"
              placeholder="Hostname, machine ID, or platform..."
              value={search}
              onChange={(e) => set({ search: e.target.value })}
            />
          </div>
        </div>

        <div className="min-w-[160px]">
          <label className="block text-sm font-medium text-gray-200 mb-2 font-inter">
            Sort By
          </label>
          <select
            className="w-full px-4 py-2.5 bg-[#111827] border border-[#374151] rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 font-inter"
            value={sort}
            onChange={(e) =>
              set({
                sort: e.target.value as
                  | "lastSeen_desc"
                  | "lastSeen_asc"
                  | "hostname_asc"
                  | "hostname_desc"
                  | "platform_asc",
              })
            }
          >
            <option value="lastSeen_desc">Last Seen ↓</option>
            <option value="lastSeen_asc">Last Seen ↑</option>
            <option value="hostname_asc">Hostname A-Z</option>
            <option value="hostname_desc">Hostname Z-A</option>
            <option value="platform_asc">Platform A-Z</option>
          </select>
        </div>

        <button
          onClick={reset}
          className="px-6 py-2.5 bg-[#1F2937] hover:bg-[#374151] text-gray-200 rounded-lg transition-all duration-200 hover:shadow-lg flex items-center space-x-2 font-inter"
        >
          <Icons.Reset className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
