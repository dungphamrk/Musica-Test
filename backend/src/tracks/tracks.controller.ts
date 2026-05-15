import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { SupabaseGuard } from '../auth/supabase.guard';
import { CreateTrackInput, TrackSort } from './tracks.types';

@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Get('me')
  @UseGuards(SupabaseGuard)
  async me() {
    return { ok: true };
  }

  @Get('filters')
  async filters() {
    return this.tracksService.filters();
  }

  @Get()
  async list(
    @Query('q') q?: string,
    @Query('genre') genre?: string,
    @Query('mood') mood?: string,
    @Query('useCase') useCase?: string,
    @Query('vocalType') vocalType?: string,
    @Query('language') language?: string,
    @Query('energyLevel') energyLevel?: string,
    @Query('minDuration') minDuration?: string,
    @Query('maxDuration') maxDuration?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('minBpm') minBpm?: string,
    @Query('maxBpm') maxBpm?: string,
    @Query('sort') sort?: TrackSort,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const parseList = (value?: string) =>
      value ? value.split(',').map((x) => x.trim()).filter(Boolean) : undefined;

    return this.tracksService.list({
      q,
      genre: parseList(genre),
      mood: parseList(mood),
      useCase: parseList(useCase),
      vocalType: parseList(vocalType),
      language: parseList(language),
      energyLevel: parseList(energyLevel),
      minDuration: minDuration ? Number(minDuration) : undefined,
      maxDuration: maxDuration ? Number(maxDuration) : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minBpm: minBpm ? Number(minBpm) : undefined,
      maxBpm: maxBpm ? Number(maxBpm) : undefined,
      sort,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    return this.tracksService.detail(id);
  }

  @Post('admin')
  @UseGuards(SupabaseGuard)
  async create(@Body() body: CreateTrackInput) {
    return this.tracksService.createTrack(body);
  }
}
