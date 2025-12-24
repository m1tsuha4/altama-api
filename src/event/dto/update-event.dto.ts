import { createZodDto } from '@anatine/zod-nestjs';
import { CreateEventSchema } from './create-event.dto';

export const UpdateEventSchema = CreateEventSchema.partial();

export class UpdateEventDto extends createZodDto(UpdateEventSchema) {}
