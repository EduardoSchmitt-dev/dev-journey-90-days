import { Feature } from '../data/features';

type FeatureListProps = {
  features: Feature[];
};

export function FeatureList({ features }: FeatureListProps) {
  return (
    <div className="space-y-3">
      {features.map(feature => (
        <div
          key={feature.id}
          className="rounded-lg border bg-white p-4 shadow-sm"
        >
          <h3 className="font-semibold">{feature.title}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
}
