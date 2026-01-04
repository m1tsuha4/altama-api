import { createZodDto } from '@anatine/zod-nestjs';
import { CreateCareerSchema } from './create-career.dto';

export const UpdateCareerSchema = CreateCareerSchema.partial();

export class UpdateCareerDto extends createZodDto(UpdateCareerSchema) {}
