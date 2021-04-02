import { PickType } from '@nestjs/mapped-types';
import { PlayerDto } from './player.dto'

export class LoginPlayerDto extends PickType(PlayerDto, ['id', 'username'] as const) {}