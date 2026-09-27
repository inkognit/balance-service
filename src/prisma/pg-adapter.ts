import { PrismaPg } from '@prisma/adapter-pg';

export function createPgAdapter(connectionString = process.env.DATABASE_URL) {
  const schema = connectionString
    ? (new URL(connectionString).searchParams.get('schema') ?? 'public')
    : 'public';

  return new PrismaPg(
    { connectionString, options: `-c search_path=${schema}` },
    { schema },
  );
}
