import { createZodDto } from '@anatine/zod-nestjs';
import { CreateApplicationSchema } from './create-application.dto';

export const UpdateApplicationSchema = CreateApplicationSchema.partial();

export class UpdateApplicationDto extends createZodDto(
  UpdateApplicationSchema,
) {}
