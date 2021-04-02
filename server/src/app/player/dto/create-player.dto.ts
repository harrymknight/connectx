import { PickType } from '@nestjs/mapped-types';
import { PlayerDto } from './player.dto';

export class CreatePlayerDto extends PickType(PlayerDto, ['username', 'password'] as const) {}