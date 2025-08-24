import { type FormEvent, useState } from "react";
import { loginApi } from "../utils/api";
import { useAuthStore } from "../store/auth.store";
import { useNavigate } from "react-router-dom";
import { Icons } from "../components/icons";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const nav = useNavigate();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    setIsLoading(true);

    try {
      const { token } = await loginApi(email, password);
      login(token);
      nav("/admin", { replace: true });
    } catch (e: unknown) {
      const error = e as { response?: { data?: { error?: string } } };
      setErr(error?.response?.data?.error || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-lg mb-4">
            <Icons.Logo className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-100 font-inter mb-2">
            Sophia
          </h1>
          <p className="text-gray-400 font-inter">System Health Dashboard</p>
        </div>

        <div className="bg-[#0A0C10] backdrop-blur-xl border border-[#1F2937]/30 rounded-lg p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-gray-100 font-inter mb-6 text-center">
            Admin Access
          </h2>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 font-inter mb-2">
                Email Address
              </label>
              <input
                className="w-full px-4 py-3 bg-[#111827] border border-[#374151] rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 font-inter"
                placeholder="admin@solsphere.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 font-inter mb-2">
                Password
              </label>
              <input
                className="w-full px-4 py-3 bg-[#111827] border border-[#374151] rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 font-inter"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {err && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <div className="flex items-center">
                  <Icons.Error className="w-5 h-5 text-red-400 mr-2" />
                  <span className="text-sm text-red-400">{err}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#0A0C10] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-inter"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Icons.Spinner className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-[#111827] rounded-lg border border-[#374151]/30">
            <h3 className="text-sm font-medium text-gray-200 font-inter mb-2">
              Demo Credentials
            </h3>
            <div className="text-xs text-gray-400 font-inter space-y-1">
              <div>
                Email:{" "}
                <span className="text-gray-200">admin@solsphere.com</span>
              </div>
              <div>
                Password: <span className="text-gray-200">admin123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
