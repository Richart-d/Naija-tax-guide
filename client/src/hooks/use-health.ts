import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useHealth() {
  return useQuery({
    queryKey: [api.health.path],
    queryFn: async () => {
      const res = await fetch(api.health.path);
      if (!res.ok) throw new Error("Failed to fetch health status");
      return api.health.responses[200].parse(await res.json());
    },
  });
}
