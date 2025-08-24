import { useMachines } from "../hooks/useMachines";
import { useAuthStore } from "../store/auth.store";
import MachineTable from "../components/MachineTable";
import Filters from "../components/Filters";
import { Icons } from "../components/icons";
import { useState } from "react";

export default function Admin() {
  const { data, isLoading, isError, refetch } = useMachines();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const machineCount = data?.length || 0;
  const healthyMachines =
    data?.filter((m) => {
      const health =
        m.latestReport?.disk_encryption?.status === "encrypted" &&
        m.latestReport?.os_updates?.status === "up_to_date" &&
        m.latestReport?.antivirus?.status === "found";
      return health;
    }).length || 0;

  return (
    <div className="min-h-screen bg-[#030712]">
      <header className="bg-[#0A0C10] backdrop-blur-xl border-b border-[#1F2937]/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div>
                  <h1 className="text-xl font-bold text-gray-100 font-inter">
                    Sophia Dashboard
                  </h1>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all duration-200 hover:shadow-lg disabled:opacity-50"
              >
                {isRefreshing ? (
                  <Icons.Spinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
                ) : (
                  <Icons.Refresh className="w-4 h-4 mr-2" />
                )}
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </button>

              <div className="flex items-center space-x-3 px-4 py-2 bg-slate-700/50 rounded-xl">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-slate-300">
                  {user?.sub ?? "admin"}
                </span>
              </div>

              <button
                onClick={() => logout()}
                className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-200 hover:shadow-lg"
              >
                <Icons.Logout className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center">
              <div className="p-3 bg-blue-600/20 rounded-xl">
                <Icons.Computer className="w-6 h-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">
                  Total Machines
                </p>
                <p className="text-2xl font-bold text-white">{machineCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center">
              <div className="p-3 bg-green-600/20 rounded-xl">
                <Icons.Check className="w-6 h-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Healthy</p>
                <p className="text-2xl font-bold text-white">
                  {healthyMachines}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-600/20 rounded-xl">
                <Icons.Warning className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Issues</p>
                <p className="text-2xl font-bold text-white">
                  {machineCount - healthyMachines}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Filters />

          {isLoading && (
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 rounded-full mb-4">
                <Icons.Spinner className="animate-spin h-8 w-8 text-blue-400" />
              </div>
              <p className="text-slate-400">Loading machine data...</p>
            </div>
          )}

          {isError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
              <div className="flex items-center">
                <Icons.Error className="w-6 h-6 text-red-400 mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-red-400">
                    Failed to load data
                  </h3>
                  <p className="text-red-300">
                    Please check your connection and try again.
                  </p>
                </div>
              </div>
            </div>
          )}

          {data && <MachineTable items={data} />}
        </div>
      </div>
    </div>
  );
}
