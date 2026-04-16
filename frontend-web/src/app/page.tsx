import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-6 text-center">
      <div className="max-w-2xl space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">
          SaaS Admin Dashboard
        </h1>

        <p className="text-lg text-slate-600">
          Plataforma administrativa para autenticação, gestão de usuários e
          gerenciamento de features.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Button asChild>
            <Link href="/login">Ir para login</Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/dashboard">Ver dashboard</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
