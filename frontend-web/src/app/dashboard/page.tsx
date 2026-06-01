"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createFeature,
  deleteFeature,
  getFeatures,
  updateFeature,
} from "@/services/features.service";

export default function DashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingFeatureId, setEditingFeatureId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error">(
    "success",
  );
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const {
    data: features = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["features"],
    queryFn: getFeatures,
  });

  function showFeedback(
    message: string,
    type: "success" | "error" = "success",
  ) {
    setFeedbackMessage(message);
    setFeedbackType(type);
  }

  const createMutation = useMutation({
    mutationFn: createFeature,
    onSuccess: async () => {
      setName("");
      setDescription("");
      showFeedback("Feature criada com sucesso.");
      await queryClient.refetchQueries({ queryKey: ["features"] });
    },
    onError: () => {
      showFeedback(
        "Não foi possível criar a feature. Verifique suas permissões e tente novamente.",
        "error",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateFeature,
    onSuccess: async () => {
      setName("");
      setDescription("");
      setEditingFeatureId(null);
      showFeedback("Feature atualizada com sucesso.");
      await queryClient.refetchQueries({ queryKey: ["features"] });
    },
    onError: () => {
      showFeedback("Não foi possível atualizar a feature.", "error");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFeature,
    onSuccess: async () => {
      showFeedback("Feature excluída com sucesso.");
      await queryClient.refetchQueries({ queryKey: ["features"] });
    },
    onError: () => {
      showFeedback("Não foi possível excluir a feature.", "error");
    },
  });

  const filteredFeatures = useMemo(() => {
    return features.filter((feature) =>
      feature.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [features, search]);

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/login");
  }

  function handleSubmitFeature(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedbackMessage("");

    if (!name.trim()) return;

    if (editingFeatureId) {
      updateMutation.mutate({
        id: editingFeatureId,
        name,
        description,
      });

      return;
    }

    createMutation.mutate({
      name,
      description,
    });
  }

  function handleEditFeature(feature: {
    id: string;
    name: string;
    description?: string | null;
  }) {
    setEditingFeatureId(feature.id);
    setName(feature.name);
    setDescription(feature.description ?? "");
  }

  function handleCancelEdit() {
    setEditingFeatureId(null);
    setName("");
    setDescription("");
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <Badge variant="outline">SaaS Admin</Badge>
            <h1 className="mt-3 text-3xl font-bold">Dashboard</h1>
            <p className="text-sm text-slate-600">
              Painel operacional para gestão de features.
            </p>
          </div>

          <Button variant="outline" onClick={handleLogout}>
            Sair
          </Button>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total de features</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">
                {isLoading ? "..." : features.length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status da API</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={isError ? "destructive" : "default"}>
                {isError ? "Offline" : "Online"}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resultado do filtro</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">
                {isLoading ? "..." : filteredFeatures.length}
              </p>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>
              {editingFeatureId ? "Editar feature" : "Nova feature"}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmitFeature} className="space-y-4">
              <Input
                placeholder="Nome da feature"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Textarea
                placeholder="Descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              {feedbackMessage && (
                <p
                  className={
                    feedbackType === "success"
                      ? "rounded-md bg-green-50 px-3 py-2 text-sm text-green-700"
                      : "rounded-md bg-red-50 px-3 py-2 text-sm text-red-700"
                  }
                >
                  {feedbackMessage}
                </p>
              )}

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {createMutation.isPending
                    ? "Criando..."
                    : updateMutation.isPending
                      ? "Salvando..."
                      : editingFeatureId
                        ? "Salvar alterações"
                        : "Criar feature"}{" "}
                </Button>

                {editingFeatureId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEdit}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-4">
            <CardTitle>Features cadastradas</CardTitle>

            <Input
              placeholder="Buscar feature..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </CardHeader>

          <CardContent>
            {isLoading && <p>Carregando...</p>}

            {!isLoading && !isError && features.length === 0 && (
              <p className="text-sm text-slate-600">
                Nenhuma feature cadastrada ainda.
              </p>
            )}

            {!isLoading &&
              !isError &&
              features.length > 0 &&
              filteredFeatures.length === 0 && (
                <p className="text-sm text-slate-600">
                  Nenhuma feature encontrada para essa busca.
                </p>
              )}

            {!isLoading &&
              filteredFeatures.map((feature) => (
                <article
                  key={feature.id}
                  className="mb-3 rounded-lg border bg-white p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">{feature.name}</h3>
                      <p className="text-sm text-slate-600">
                        {feature.description || "Sem descrição"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Feature</Badge>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditFeature(feature)}
                      >
                        Editar
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={deleteMutation.isPending}
                        onClick={() => {
                          const confirmed = window.confirm(
                            `Excluir "${feature.name}"?`,
                          );

                          if (confirmed) {
                            deleteMutation.mutate(feature.id);
                          }
                        }}
                      >
                        {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
