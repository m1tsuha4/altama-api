import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto, CreateEventSchema } from './dto/create-event.dto';
import { UpdateEventDto, UpdateEventSchema } from './dto/update-event.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-guard.auth';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { UploadImageInterceptor } from 'src/common/interceptors/multer-config.interceptors';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UploadImageInterceptor('event')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Event Title' },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @Post()
  create(
    @Body(new ZodValidationPipe(CreateEventSchema))
    createEventDto: CreateEventDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.eventService.create(createEventDto, file);
  }

  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UploadImageInterceptor('event')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Event Title' },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateEventSchema))
    updateEventDto: UpdateEventDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.eventService.update(id, updateEventDto, file);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.remove(id);
  }
}
