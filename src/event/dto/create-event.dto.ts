import { createZodDto } from '@anatine/zod-nestjs';
import z from 'zod';

export const CreateEventSchema = z.object({
  title: z.string().optional(),
});

export class CreateEventDto extends createZodDto(CreateEventSchema) {}
