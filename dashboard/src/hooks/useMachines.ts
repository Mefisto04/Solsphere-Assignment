import { useQuery } from "@tanstack/react-query";
import { getMachines } from "../utils/api";
import type { MachinesResponse } from "../types/api";
import { useFiltersStore } from "../store/filters.store";

export function useMachines() {
    const { os, status, search, sort } = useFiltersStore();

    return useQuery({
        queryKey: ["machines", { os, status, search, sort }],
        queryFn: async () => {
            const params: Record<string, string> = {};
            if (os && os !== "all") params.platform = os;
            if (status && status !== "all") params.status = status;
            if (search) params.q = search;
            if (sort) params.sort = sort;
            const data = (await getMachines(params)) as MachinesResponse;
            return data.data;
        },
        staleTime: 10_000,
    });
}

