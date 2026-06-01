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
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg shadow-black/20 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <Badge
              variant="outline"
              className="border-slate-700 text-slate-300"
            >
              SaaS Admin
            </Badge>

            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Feature Management
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-400">
                Painel operacional para gerenciar features, acompanhar status da
                API e validar fluxos administrativos em ambiente fullstack.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-slate-700 bg-slate-950 text-slate-100 hover:bg-slate-800"
          >
            Sair
          </Button>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <Card className="border-slate-800 bg-slate-900 text-slate-100 shadow-lg shadow-black/10">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-400">
                Total de features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {isLoading ? "..." : features.length}
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900 text-slate-100 shadow-lg shadow-black/10">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-400">
                Status da API
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={isError ? "destructive" : "default"}>
                {isError ? "Offline" : "Online"}
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900 text-slate-100 shadow-lg shadow-black/10">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-400">
                Resultado do filtro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {isLoading ? "..." : filteredFeatures.length}
              </p>
            </CardContent>
          </Card>
        </section>

        <Card className="border-slate-800 bg-slate-900 text-slate-100 shadow-lg shadow-black/10">
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
                className="border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500"
              />

              <Textarea
                placeholder="Descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-28 border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500"
              />

              {feedbackMessage && (
                <p
                  className={
                    feedbackType === "success"
                      ? "rounded-lg border border-emerald-900 bg-emerald-950 px-3 py-2 text-sm text-emerald-300"
                      : "rounded-lg border border-red-900 bg-red-950 px-3 py-2 text-sm text-red-300"
                  }
                >
                  {feedbackMessage}
                </p>
              )}

              <div className="flex flex-col gap-2 sm:flex-row">
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
                        : "Criar feature"}
                </Button>

                {editingFeatureId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEdit}
                    className="border-slate-700 bg-slate-950 text-slate-100 hover:bg-slate-800"
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900 text-slate-100 shadow-lg shadow-black/10">
          <CardHeader className="space-y-4">
            <div>
              <CardTitle>Features cadastradas</CardTitle>
              <p className="mt-1 text-sm text-slate-400">
                Consulte, edite ou remova features disponíveis no painel.
              </p>
            </div>

            <Input
              placeholder="Buscar feature..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500"
            />
          </CardHeader>

          <CardContent className="space-y-3">
            {isLoading && (
              <p className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-sm text-slate-400">
                Carregando features...
              </p>
            )}

            {!isLoading && !isError && features.length === 0 && (
              <div className="rounded-lg border border-dashed border-slate-700 bg-slate-950 p-6 text-center">
                <p className="font-medium text-slate-200">
                  Nenhuma feature cadastrada ainda.
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Crie a primeira feature usando o formulário acima.
                </p>
              </div>
            )}

            {!isLoading &&
              !isError &&
              features.length > 0 &&
              filteredFeatures.length === 0 && (
                <div className="rounded-lg border border-dashed border-slate-700 bg-slate-950 p-6 text-center">
                  <p className="font-medium text-slate-200">
                    Nenhuma feature encontrada.
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Tente buscar por outro nome.
                  </p>
                </div>
              )}

            {!isLoading &&
              filteredFeatures.map((feature) => (
                <article
                  key={feature.id}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-4 transition hover:border-slate-700"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-100">
                          {feature.name}
                        </h3>
                        <Badge variant="secondary">Feature</Badge>
                      </div>

                      <p className="text-sm text-slate-400">
                        {feature.description || "Sem descrição"}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditFeature(feature)}
                        className="border-slate-700 bg-slate-950 text-slate-100 hover:bg-slate-800"
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
