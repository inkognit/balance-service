import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DebitDto } from './dto/debit.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiNotFoundResponse({ description: 'USER_NOT_FOUND' })
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUser(id);
  }

  @Get(':id/transactions')
  getTransactions(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getTransactions(id);
  }

  @Post(':id/debit')
  @ApiCreatedResponse({ description: 'Новый баланс' })
  @ApiBadRequestResponse({
    description: 'INSUFFICIENT_FUNDS или невалидный amount',
  })
  debit(@Param('id', ParseIntPipe) id: number, @Body() { amount }: DebitDto) {
    return this.usersService.debit(id, amount);
  }
}
