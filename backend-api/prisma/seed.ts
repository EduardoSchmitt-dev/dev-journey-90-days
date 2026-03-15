import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const plans = ['FREE', 'PRO', 'ENTERPRISE'];

  for (const name of plans) {
    await prisma.plan.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log('Plans seeded successfully.');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
