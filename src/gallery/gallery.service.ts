import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { basename, join } from 'node:path';
import { existsSync, unlinkSync } from 'node:fs';

@Injectable()
export class GalleryService {
  constructor(private readonly prisma: PrismaService) {}
  create(createGalleryDto: CreateGalleryDto, image?: Express.Multer.File) {
    return this.prisma.webGallery.create({
      data: {
        ...createGalleryDto,
        image: `/uploads/gallery/${image?.filename}`,
      },
    });
  }

  async findAll() {
    return this.prisma.webGallery.findMany({
      select: {
        id: true,
        title: true,
        image: true,
      },
    });
  }

  async findOne(id: string) {
    const gallery = await this.prisma.webGallery.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        image: true,
      },
    });

    if (!gallery) {
      throw new BadRequestException('Gallery Not Found');
    }

    return gallery;
  }

  async update(
    id: string,
    updateGalleryDto: UpdateGalleryDto,
    image?: Express.Multer.File,
  ) {
    const gallery = await this.findOne(id);

    const uploadRoot = join(process.cwd(), 'uploads', 'gallery');
    if (image) {
      const fileName = basename(gallery.image);
      const filePath = join(uploadRoot, fileName);
      if (existsSync(filePath)) {
        unlinkSync(filePath);
      }
    }

    return this.prisma.webGallery.update({
      where: { id },
      data: {
        ...updateGalleryDto,
        image: image ? `/uploads/gallery/${image?.filename}` : gallery.image,
      },
    });
  }

  async remove(id: string) {
    const gallery = await this.findOne(id);

    const uploadRoot = join(process.cwd(), 'uploads', 'gallery');
    const fileName = basename(gallery.image);
    const filePath = join(uploadRoot, fileName);
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }

    return this.prisma.webGallery.delete({
      where: { id },
    });
  }
}
