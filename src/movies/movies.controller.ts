import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Movies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @ApiOperation({ summary: 'Ajouter un film a sa liste' })
  @ApiResponse({ status: 201, description: 'Movie added successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(
    @Body() createMovieDto: CreateMovieDto,
    @CurrentUser() user: any,
  ) {
    return this.moviesService.create(createMovieDto, user.id);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Recuperer tous ses films - route user (Admin recuperer tous les films des users)' 
  })
  @ApiResponse({ status: 200, description: 'Movies retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@CurrentUser() user: any) {
    return this.moviesService.findAll(user.id, user.role);
  }

  @Get('all')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Recuperer tous les films de tout les user - route Admin' })
  @ApiResponse({ status: 200, description: 'All movies retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  findAllMovies(@CurrentUser() user: any) {
    return this.moviesService.findAll(0, Role.ADMIN);
  }

  @Get(':id')
  @ApiOperation({ summary: 'recuperer un film grace a son id' })
  @ApiResponse({ status: 200, description: 'Movie retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not your movie' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.moviesService.findOne(id, user.id, user.role);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'modifier' })
  @ApiResponse({ status: 200, description: 'Movie updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not your movie' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovieDto: UpdateMovieDto,
    @CurrentUser() user: any,
  ) {
    return this.moviesService.update(id, updateMovieDto, user.id, user.role);
  }

  @Patch(':id/watch')
  @ApiOperation({ summary: 'Marquer comme deja vu le film' })
  @ApiResponse({ status: 200, description: 'Movie marked as watched' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not your movie' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  markAsWatched(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.moviesService.markAsWatched(id, user.id, user.role);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer le film' })
  @ApiResponse({ status: 200, description: 'Movie removed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not your movie' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.moviesService.remove(id, user.id, user.role);
  }
}
