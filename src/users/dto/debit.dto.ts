import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class DebitDto {
  @ApiProperty({
    type: 'integer',
    example: 2000,
    description: 'Сумма в копейках',
  })
  @IsInt()
  @IsPositive()
  amount!: number;
}
