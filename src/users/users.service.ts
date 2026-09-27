import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Action } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, balance: true },
    });
    if (!user) throw new NotFoundException('USER_NOT_FOUND');
    return user;
  }

  async getTransactions(id: number) {
    await this.getUser(id);
    return this.prisma.transaction.findMany({
      where: { userId: id },
      orderBy: { ts: 'desc' },
    });
  }

  async debit(id: number, amount: number) {
    return this.prisma.$transaction(async (tx) => {
      const [user] = await tx.$queryRaw<{ id: number; balance: number }[]>`
        SELECT id, balance FROM users WHERE id = ${id} FOR UPDATE
      `;
      if (!user) throw new NotFoundException('USER_NOT_FOUND');
      if (user.balance < amount) {
        throw new BadRequestException('INSUFFICIENT_FUNDS');
      }

      await tx.transaction.create({
        data: { userId: id, action: Action.DEBIT, amount },
      });

      return tx.user.update({
        where: { id },
        data: { balance: { decrement: amount } },
        select: { id: true, balance: true },
      });
    });
  }
}
