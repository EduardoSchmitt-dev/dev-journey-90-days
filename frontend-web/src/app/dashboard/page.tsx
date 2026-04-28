"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getFeatures } from "@/services/features.service";

export default function DashboardPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

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

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <Badge variant="outline">SaaS Admin</Badge>
            <h1 className="mt-3 text-3xl font-bold">Dashboard</h1>
            <p className="text-sm text-slate-600">
              Painel operacional para gestão de features do sistema.
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
          <CardHeader className="space-y-4">
            <div>
              <CardTitle>Features cadastradas</CardTitle>
              <p className="text-sm text-slate-600">
                Lista sincronizada com a API autenticada.
              </p>
            </div>

            <Input
              placeholder="Buscar feature pelo nome..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </CardHeader>

          <CardContent>
            {isLoading && (
              <p className="text-sm text-slate-500">Carregando features...</p>
            )}

            {isError && (
              <p className="text-sm text-red-500">Erro ao carregar features.</p>
            )}

            {!isLoading && !isError && filteredFeatures.length === 0 && (
              <p className="text-sm text-slate-500">
                Nenhuma feature encontrada.
              </p>
            )}

            {!isLoading && !isError && filteredFeatures.length > 0 && (
              <div className="space-y-3">
                {filteredFeatures.map((feature) => (
                  <article
                    key={feature.id}
                    className="rounded-lg border bg-white p-4 transition hover:bg-slate-50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold">{feature.name}</h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {feature.description || "Sem descrição"}
                        </p>
                      </div>

                      <Badge variant="secondary">Feature</Badge>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
