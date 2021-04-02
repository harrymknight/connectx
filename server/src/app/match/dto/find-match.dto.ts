import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Match } from '../entities/match.entity';

export class FindMatchDto extends PartialType(OmitType(Match, ['password'])) {}