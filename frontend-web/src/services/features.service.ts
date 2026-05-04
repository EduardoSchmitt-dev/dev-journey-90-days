import { api } from "@/lib/axios";
import type { Feature } from "@/types/feature";

type CreateFeatureRequest = {
  name: string;
  description?: string;
};

type UpdateFeatureRequest = {
  id: string;
  name: string;
  description?: string;
};

export async function getFeatures(): Promise<Feature[]> {
  const response = await api.get("/api/v1/features");

  return Array.isArray(response.data) ? response.data : response.data.data;
}

export async function createFeature(
  data: CreateFeatureRequest,
): Promise<Feature> {
  const response = await api.post("/api/v1/features", data);
  return response.data;
}

export async function updateFeature({
  id,
  name,
  description,
}: UpdateFeatureRequest): Promise<Feature> {
  const response = await api.patch(`/api/v1/features/${id}`, {
    name,
    description,
  });
  return response.data;
}

export async function deleteFeature(id: string): Promise<void> {
  await api.delete(`/api/v1/features/${id}`);
}
