import { createZodDto } from '@anatine/zod-nestjs';
import z from 'zod';

export const CreateCareerSchema = z.object({
  title: z.string().optional(),
  overview: z.string().optional(),
  link: z.string().optional(),
  location: z.string().optional(),
  type: z.string().optional(),
  date: z.coerce.date().optional(),

  requirements: z
    .array(
      z.object({
        title: z.string(),
        description: z.string().optional(),
      }),
    )
    .optional(),
});

export class CreateCareerDto extends createZodDto(CreateCareerSchema) {}
