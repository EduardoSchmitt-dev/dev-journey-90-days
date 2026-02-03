import { Card } from './nginx/components/Card';
import { FeatureList } from './nginx/components/FeatureList';
import { features } from './nginx/data/features';

export default function Home() {
  return (
    <main className="space-y-4">
      <h2 className="text-xl font-bold">
        Week 2 - Next.js App Router 🚀
      </h2>

      <Card
        title="Routing"
        description="File-based routing with App Router"
      />

      <Card
        title="Layout"
        description="Reusable layout with header and navigation"
      />

      <p className="text-sm text-gray-600">
        Mobile first layout with Tailwind.
      </p>
      <FeatureList features={features} />
    </main>
  );
}
