import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { basename, join } from 'path';
import { existsSync, unlinkSync } from 'fs';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEventDto: CreateEventDto, file?: Express.Multer.File) {
    return this.prisma.event.create({
      data: {
        title: createEventDto.title,
        image: `/uploads/event/${file?.filename}`,
      },
    });
  }

  async findAll() {
    return this.prisma.event.findMany({
      select: {
        id: true,
        title: true,
        image: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        image: true,
      },
    });

    if (!event) {
      throw new BadRequestException('Event Not Found');
    }

    return event;
  }

  async update(
    id: string,
    updateEventDto: UpdateEventDto,
    file?: Express.Multer.File,
  ) {
    const event = await this.findOne(id);

    const uploadRoot = join(process.cwd(), 'uploads', 'event');
    if (file) {
      const fileName = basename(event.image);
      const filePath = join(uploadRoot, fileName);
      if (existsSync(filePath)) {
        unlinkSync(filePath);
      }
    }

    return this.prisma.event.update({
      where: { id },
      data: {
        ...updateEventDto,
        image: file ? `/uploads/event/${file.filename}` : event.image,
      },
    });
  }

  async remove(id: string) {
    const event = await this.findOne(id);

    const uploadRoot = join(process.cwd(), 'uploads', 'event');
    if (event.image) {
      const fileName = basename(event.image);
      const filePath = join(uploadRoot, fileName);
      if (existsSync(filePath)) {
        unlinkSync(filePath);
      }
    }

    return this.prisma.event.delete({
      where: { id },
    });
  }
}
