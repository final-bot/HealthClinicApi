import { useQuery } from "@tanstack/react-query";

const API_URL = "http://localhost:3000";

export function useAppointments(params: any) {
  return useQuery({
    queryKey: ["appointments", params],
    queryFn: async () => {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_URL}/appointments?${query}`, {
        headers: { "x-role": "admin" },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Error fetching");
      }

      return res.json();
    },
  });
}