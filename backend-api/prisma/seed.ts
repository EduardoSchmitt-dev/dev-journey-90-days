import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const plans = ["Free", "Pro", "Enterprise"];

  for (const name of plans) {
    await prisma.plan.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log("Plans seeded successfully.");

  const freePlan = await prisma.plan.findUnique({
    where: { name: "Free" },
  });

  if (freePlan) {
    await prisma.user.updateMany({
  data: { planId: freePlan.id },
  })
}

  console.log("Users updated with Free plan.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
