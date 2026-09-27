# balance-service

NestJS + Prisma + PostgreSQL.

## Запуск

```bash
cp .env.example .env
docker compose up -d
npm install
npx prisma migrate deploy
npx prisma db seed
npm run start:dev
```

Seed создаёт пользователя с id 1 и балансом 10000.

## API

- `POST /users/:id/debit` — списание, body: `{ "amount": 100 }`
- `GET /users/:id` — баланс
- `GET /users/:id/transactions` — история операций

Суммы в копейках/центах (int).

## Списание

Выполняется в транзакции с `SELECT ... FOR UPDATE` по строке пользователя, чтобы параллельные запросы не могли списать больше, чем есть на балансе. Запись в `transactions` и изменение `users.balance` идут в той же транзакции.

Ошибки: `404 USER_NOT_FOUND`, `400 INSUFFICIENT_FUNDS`, `400` на невалидный amount.
