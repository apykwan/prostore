import { PrismaClient } from '@prisma/client';

import sampleData from './sample-data';
import { hash } from '@/lib/encrypt';

async function main() {
  const prisma = new PrismaClient();

  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();

  const users = await Promise.all(
    sampleData.users.map(async (user) => ({
      ...user,
      password: await hash(user.password as string)
    }))
  );
  await prisma.user.createMany({ data: users });
  await prisma.product.createMany({ data: sampleData.products });

  console.log('Database seeded successfully!');
}

main();