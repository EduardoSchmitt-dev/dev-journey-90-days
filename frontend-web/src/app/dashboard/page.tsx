import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-sm text-slate-600">
            Painel inicial do sistema SaaS.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total de features</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">--</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usuários ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">--</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status da API</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">Online</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
