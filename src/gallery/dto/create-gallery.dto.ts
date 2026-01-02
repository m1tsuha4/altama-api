import { createZodDto } from '@anatine/zod-nestjs';
import z from 'zod';

export const CreateGallerySchema = z.object({
  title: z.string().optional(),
});

export class CreateGalleryDto extends createZodDto(CreateGallerySchema) {}
