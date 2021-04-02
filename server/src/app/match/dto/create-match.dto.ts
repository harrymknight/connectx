import { OmitType, PartialType } from "@nestjs/mapped-types";
import { Match } from "../entities/match.entity";

export class CreateMatchDto extends PartialType(OmitType(Match, ['id'])) {}