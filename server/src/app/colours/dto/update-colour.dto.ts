import { PartialType } from '@nestjs/mapped-types';
import { CreateColourDto } from './create-colour.dto';

export class UpdateColourDto extends PartialType(CreateColourDto) {}
