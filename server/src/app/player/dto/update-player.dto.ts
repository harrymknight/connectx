import { OmitType, PartialType } from '@nestjs/mapped-types';
import { PlayerDto } from './player.dto';

export class UpdatePlayerDto extends PartialType(OmitType(PlayerDto, ['id'] as const)) {}
