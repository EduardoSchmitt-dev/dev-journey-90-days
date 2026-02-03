export type Feature = {
  id: number;
  title: string;
  description: string;
};

export const features: Feature[] = [
  {
    id: 1,
    title: 'Routing',
    description: 'File-based routing using Next.js App Router',
  },
  {
    id: 2,
    title: 'Reusable Components',
    description: 'UI components shared across pages',
  },
  {
    id: 3,
    title: 'Mobile First',
    description: 'Responsive design with Tailwind CSS',
  },
];
