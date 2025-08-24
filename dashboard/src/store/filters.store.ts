import { create } from "zustand";

export type Filters = {
    os?: "windows" | "linux" | "darwin" | "all";
    status?: "ok" | "issue" | "unknown" | "all";
    search?: string;
    sort?: "lastSeen_desc" | "lastSeen_asc" | "hostname_asc" | "hostname_desc" | "platform_asc";
};

type State = Filters & {
    set: (patch: Partial<Filters>) => void;
    reset: () => void;
};

export const useFiltersStore = create<State>((set) => ({
    os: "all",
    status: "all",
    search: "",
    sort: "lastSeen_desc",
    set: (patch) => set(patch),
    reset: () => set({ os: "all", status: "all", search: "", sort: "lastSeen_desc" }),
}));
