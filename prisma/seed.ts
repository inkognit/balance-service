import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { createPgAdapter } from '../src/prisma/pg-adapter';

const prisma = new PrismaClient({ adapter: createPgAdapter() });

async function main() {
  await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, balance: 10000 },
  });
  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('users', 'id'), (SELECT MAX(id) FROM users))`;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
