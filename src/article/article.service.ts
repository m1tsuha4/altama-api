import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import slugify from 'slugify';
import { basename, join } from 'path';
import { existsSync, unlinkSync } from 'fs';

@Injectable()
export class ArticleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createArticleDto: CreateArticleDto,
    image?: Express.Multer.File,
  ) {
    const slug =
      createArticleDto.slug ??
      slugify(createArticleDto.title, { strict: true, lower: true });
    const slugExist = await this.prisma.article.findUnique({ where: { slug } });
    if (slugExist) {
      throw new BadRequestException('Slug already exists');
    }

    let metaTags: any = undefined;
    if (createArticleDto.metaTags) {
      try {
        metaTags =
          typeof createArticleDto.metaTags === 'string'
            ? JSON.parse(createArticleDto.metaTags)
            : createArticleDto.metaTags;
      } catch (e) {
        throw new BadRequestException('Invalid metaTags');
      }
    }

    return await this.prisma.article.create({
      data: {
        ...createArticleDto,
        slug,
        metaTags,
        primaryImage: image ? `/uploads/primary-image/${image.filename}` : null,
      },
    });
  }

  async findAll() {
    return await this.prisma.article.findMany({
      select: {
        id: true,
        title: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        slug: true,
        excerpt: true,
        contentHtml: true,
        primaryImage: true,
        seoTitle: true,
        seoDescription: true,
        seoKeywords: true,
        metaTags: true,
        author: true,
        publishedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findAllImageArticle() {
    return await this.prisma.imageArticle.findMany({
      select: {
        id: true,
        url: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async uploadImage(image: Express.Multer.File) {
    return await this.prisma.imageArticle.create({
      data: {
        url: `/uploads/article-image/${image.filename}`,
      },
    });
  }

  async removeImage(id: string) {
    const image = await this.prisma.imageArticle.findUnique({ where: { id } });
    if (!image) {
      throw new BadRequestException('Image not found');
    }
    const uploadRoot = join(process.cwd(), 'uploads', 'article-image');
    if (image.url) {
      const fileName = basename(image.url);
      const filePath = join(uploadRoot, fileName);
      if (existsSync(filePath)) {
        unlinkSync(filePath);
      }
    }
    return await this.prisma.imageArticle.delete({ where: { id } });
  }

  async findLatestArticle() {
    return await this.prisma.article.findMany({
      select: {
        id: true,
        title: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        slug: true,
        excerpt: true,
        contentHtml: true,
        primaryImage: true,
        seoTitle: true,
        seoDescription: true,
        seoKeywords: true,
        metaTags: true,
        author: true,
        publishedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 3,
    });
  }

  async findOne(id: string) {
    const article = await this.prisma.article.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        slug: true,
        excerpt: true,
        contentHtml: true,
        primaryImage: true,
        seoTitle: true,
        seoDescription: true,
        seoKeywords: true,
        metaTags: true,
        author: true,
        publishedAt: true,
      },
    });
    if (!article) {
      throw new BadRequestException('Article not found');
    }
    return article;
  }

  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
    image?: Express.Multer.File,
  ) {
    const article = await this.findOne(id);
    const slug = updateArticleDto.title
      ? slugify(updateArticleDto.title, { strict: true, lower: true })
      : article.slug;
    const slugExist = await this.prisma.article.findUnique({ where: { slug } });
    if (slugExist && slugExist.id !== id) {
      throw new BadRequestException('Slug already exists');
    }

    let metaTags: any = undefined;
    if (updateArticleDto.metaTags) {
      try {
        metaTags =
          typeof updateArticleDto.metaTags === 'string'
            ? JSON.parse(updateArticleDto.metaTags)
            : updateArticleDto.metaTags;
      } catch (e) {
        throw new BadRequestException('Invalid metaTags');
      }
    }

    const uploadRoot = join(process.cwd(), 'uploads', 'primary-image');
    if (image && article.primaryImage) {
      const fileName = basename(article.primaryImage);
      const filePath = join(uploadRoot, fileName);
      if (existsSync(filePath)) {
        unlinkSync(filePath);
      }
    }

    return await this.prisma.article.update({
      where: { id },
      data: {
        ...updateArticleDto,
        slug,
        metaTags,
        primaryImage: image
          ? `/uploads/primary-image/${image.filename}`
          : article.primaryImage,
      },
    });
  }

  async remove(id: string) {
    const article = await this.findOne(id);
    const uploadRoot = join(process.cwd(), 'uploads', 'primary-image');
    if (article.primaryImage) {
      const fileName = basename(article.primaryImage);
      const filePath = join(uploadRoot, fileName);
      if (existsSync(filePath)) {
        unlinkSync(filePath);
      }
    }
    return await this.prisma.article.delete({ where: { id } });
  }
}
