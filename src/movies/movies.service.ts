import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Role } from '@prisma/client';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  async create(createMovieDto: CreateMovieDto, userId: number) {
    return this.prisma.movie.create({
      data: {
        ...createMovieDto,
        userId,
        watchedAt: createMovieDto.watchedAt ? new Date(createMovieDto.watchedAt) : null,
      },
    });
  }

  async findAll(userId: number, userRole: Role) {
    if (userRole === Role.ADMIN) {
      return this.prisma.movie.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return this.prisma.movie.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, userId: number, userRole: Role) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    
    if (userRole !== Role.ADMIN && movie.userId !== userId) {
      throw new ForbiddenException('You can only access your own movies');
    }

    return movie;
  }

  async update(id: number, updateMovieDto: UpdateMovieDto, userId: number, userRole: Role) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    
    if (userRole !== Role.ADMIN && movie.userId !== userId) {
      throw new ForbiddenException('You can only update your own movies');
    }

    return this.prisma.movie.update({
      where: { id },
      data: {
        ...updateMovieDto,
        watchedAt: updateMovieDto.watchedAt ? new Date(updateMovieDto.watchedAt) : undefined,
      },
    });
  }

  async remove(id: number, userId: number, userRole: Role) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    
    if (userRole !== Role.ADMIN && movie.userId !== userId) {
      throw new ForbiddenException('You can only delete your own movies');
    }

    return this.prisma.movie.delete({
      where: { id },
    });
  }

  async markAsWatched(id: number, userId: number, userRole: Role) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    
    if (userRole !== Role.ADMIN && movie.userId !== userId) {
      throw new ForbiddenException('You can only modify your own movies');
    }

    return this.prisma.movie.update({
      where: { id },
      data: {
        watched: true,
        watchedAt: new Date(),
      },
    });
  }
}
