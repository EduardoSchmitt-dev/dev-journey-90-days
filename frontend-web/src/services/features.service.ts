import { api } from "@/lib/axios";
import type { Feature } from "@/types/feature";

export async function getFeatures(): Promise<Feature[]> {
  const response = await api.get("/api/v1/features");

  return Array.isArray(response.data) ? response.data : response.data.data;
}
