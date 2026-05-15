import { Injectable, NotFoundException } from '@nestjs/common';
import { mockTracks } from './mock-tracks';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateTrackInput, TrackItem, TrackListQuery } from './tracks.types';

@Injectable()
export class TracksService {
  private tracks: TrackItem[] = [...mockTracks];
  private seededToDb = false;

  constructor(private readonly supabaseService: SupabaseService) {}

  private toCard(track: TrackItem) {
    return {
      id: track.id,
      asset_id: track.asset_id,
      title: track.title,
      artist_name: track.artist_name,
      cover_image_url: track.cover_image_url,
      price: track.price,
      currency: track.currency,
      genre: track.genre,
      mood: track.mood,
      use_case: track.use_case,
      duration: track.duration,
      bpm: track.bpm,
      verification_status: track.verification_status,
      commercial_allowed: track.commercial_allowed,
      youtube_allowed: track.youtube_allowed,
    };
  }

  private async ensureSeededToSupabase() {
    if (this.seededToDb) return;
    if (!this.supabaseService.isConfigured()) return;

    const client = this.supabaseService.getClient();
    const { count, error } = await client
      .from('tracks')
      .select('id', { count: 'exact', head: true });

    if (error) {
      throw new Error(
        'Supabase table `tracks` is not ready. Create it in Supabase SQL Editor, then restart backend.',
      );
    }

    if ((count ?? 0) > 0) {
      this.seededToDb = true;
      return;
    }

    const { error: insertError } = await client.from('tracks').insert(this.tracks);
    if (insertError) throw insertError;

    this.seededToDb = true;
  }

  private matches(track: TrackItem, query: TrackListQuery) {
    const q = query.q?.trim().toLowerCase();
    if (q) {
      const haystack = [
        track.title,
        track.artist_name,
        track.composer,
        track.publisher,
        track.description,
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    if (query.genre?.length && !query.genre.some((g) => track.genre.includes(g))) return false;
    if (query.mood?.length && !query.mood.some((m) => track.mood.includes(m))) return false;
    if (query.useCase?.length && !query.useCase.some((u) => track.use_case.includes(u))) return false;
    if (query.vocalType?.length && !query.vocalType.includes(track.vocal_type)) return false;
    if (query.language?.length && !query.language.includes(track.language)) return false;
    if (query.energyLevel?.length && !query.energyLevel.includes(track.energy_level)) return false;
    if (typeof query.minDuration === 'number' && track.duration < query.minDuration) return false;
    if (typeof query.maxDuration === 'number' && track.duration > query.maxDuration) return false;
    if (typeof query.minPrice === 'number' && track.price < query.minPrice) return false;
    if (typeof query.maxPrice === 'number' && track.price > query.maxPrice) return false;
    if (typeof query.minBpm === 'number' && track.bpm < query.minBpm) return false;
    if (typeof query.maxBpm === 'number' && track.bpm > query.maxBpm) return false;

    return track.status === 'published' && track.visibility === 'public' && !track.deleted_at;
  }

  private sortItems(items: TrackItem[], sort: TrackListQuery['sort']) {
    const next = [...items];
    switch (sort) {
      case 'trending':
        return next.sort((a, b) => b.trending_score - a.trending_score);
      case 'most_downloaded':
        return next.sort((a, b) => b.download_count - a.download_count);
      case 'price_low_to_high':
        return next.sort((a, b) => a.price - b.price);
      case 'price_high_to_low':
        return next.sort((a, b) => b.price - a.price);
      case 'new':
      default:
        return next.sort((a, b) => b.release_date.localeCompare(a.release_date));
    }
  }

  async list(query: TrackListQuery) {
    if (this.supabaseService.isConfigured()) {
      await this.ensureSeededToSupabase();

      const client = this.supabaseService.getClient();
      const page = query.page && query.page > 0 ? query.page : 1;
      const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 12;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let sb = client
        .from('tracks')
        .select(
          'id,asset_id,title,artist_name,cover_image_url,price,currency,genre,mood,use_case,duration,bpm,verification_status,commercial_allowed,youtube_allowed',
          { count: 'exact' },
        )
        .eq('status', 'published')
        .eq('visibility', 'public');

      if (query.q && query.q.trim().length > 0) {
        const q = query.q.trim();
        sb = sb.or(
          `title.ilike.%${q}%,artist_name.ilike.%${q}%,composer.ilike.%${q}%,publisher.ilike.%${q}%`,
        );
      }

      if (query.genre?.length) sb = sb.contains('genre', query.genre);
      if (query.mood?.length) sb = sb.contains('mood', query.mood);
      if (query.useCase?.length) sb = sb.contains('use_case', query.useCase);
      if (query.vocalType?.length) sb = sb.in('vocal_type', query.vocalType);
      if (query.language?.length) sb = sb.in('language', query.language);
      if (query.energyLevel?.length) sb = sb.in('energy_level', query.energyLevel);
      if (typeof query.minDuration === 'number') sb = sb.gte('duration', query.minDuration);
      if (typeof query.maxDuration === 'number') sb = sb.lte('duration', query.maxDuration);
      if (typeof query.minPrice === 'number') sb = sb.gte('price', query.minPrice);
      if (typeof query.maxPrice === 'number') sb = sb.lte('price', query.maxPrice);
      if (typeof query.minBpm === 'number') sb = sb.gte('bpm', query.minBpm);
      if (typeof query.maxBpm === 'number') sb = sb.lte('bpm', query.maxBpm);

      const sort = query.sort ?? 'new';
      if (sort === 'new') sb = sb.order('release_date', { ascending: false });
      if (sort === 'trending') sb = sb.order('trending_score', { ascending: false });
      if (sort === 'most_downloaded') sb = sb.order('download_count', { ascending: false });
      if (sort === 'price_low_to_high') sb = sb.order('price', { ascending: true });
      if (sort === 'price_high_to_low') sb = sb.order('price', { ascending: false });

      const { data, error, count } = await sb.range(from, to);
      if (error) throw error;

      return {
        data: data ?? [],
        page,
        pageSize,
        total: count ?? 0,
      };
    }

    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 12;
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    const filtered = this.sortItems(
      this.tracks.filter((track) => this.matches(track, query)),
      query.sort ?? 'new',
    );

    return {
      data: filtered.slice(from, to).map((track) => this.toCard(track)),
      page,
      pageSize,
      total: filtered.length,
    };
  }

  async filters() {
    if (this.supabaseService.isConfigured()) {
      await this.ensureSeededToSupabase();
      const client = this.supabaseService.getClient();

      const { data, error } = await client
        .from('tracks')
        .select('genre,mood,use_case,vocal_type,language,energy_level,duration,price,bpm')
        .eq('status', 'published')
        .eq('visibility', 'public');

      if (error) throw error;

      const rows = (data ?? []) as any[];
      const unique = (values: string[]) => [...new Set(values)].sort((a, b) => a.localeCompare(b));
      const durations = rows.map((row) => row.duration as number);
      const prices = rows.map((row) => row.price as number);
      const bpms = rows.map((row) => row.bpm as number);

      return {
        genres: unique(rows.flatMap((row) => (row.genre as string[]) ?? [])),
        moods: unique(rows.flatMap((row) => (row.mood as string[]) ?? [])),
        useCases: unique(rows.flatMap((row) => (row.use_case as string[]) ?? [])),
        vocalTypes: unique(rows.map((row) => row.vocal_type as string).filter(Boolean)),
        languages: unique(rows.map((row) => row.language as string).filter(Boolean)),
        energyLevels: unique(rows.map((row) => row.energy_level as string).filter(Boolean)),
        stats: {
          total: rows.length,
          minDuration: Math.min(...durations),
          maxDuration: Math.max(...durations),
          minPrice: Math.min(...prices),
          maxPrice: Math.max(...prices),
          minBpm: Math.min(...bpms),
          maxBpm: Math.max(...bpms),
        },
      };
    }

    const published = this.tracks.filter(
      (track) => track.status === 'published' && track.visibility === 'public' && !track.deleted_at,
    );

    const unique = (values: string[]) => [...new Set(values)].sort((a, b) => a.localeCompare(b));
    const durations = published.map((track) => track.duration);
    const prices = published.map((track) => track.price);
    const bpms = published.map((track) => track.bpm);

    return {
      genres: unique(published.flatMap((track) => track.genre)),
      moods: unique(published.flatMap((track) => track.mood)),
      useCases: unique(published.flatMap((track) => track.use_case)),
      vocalTypes: unique(published.map((track) => track.vocal_type)),
      languages: unique(published.map((track) => track.language)),
      energyLevels: unique(published.map((track) => track.energy_level)),
      stats: {
        total: published.length,
        minDuration: Math.min(...durations),
        maxDuration: Math.max(...durations),
        minPrice: Math.min(...prices),
        maxPrice: Math.max(...prices),
        minBpm: Math.min(...bpms),
        maxBpm: Math.max(...bpms),
      },
    };
  }

  async detail(id: string) {
    if (this.supabaseService.isConfigured()) {
      await this.ensureSeededToSupabase();
      const client = this.supabaseService.getClient();
      const { data, error } = await client.from('tracks').select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    }

    const track = this.tracks.find((item) => item.id === id);
    if (!track) throw new NotFoundException('Track not found');
    return track;
  }

  async createTrack(input: CreateTrackInput) {
    if (this.supabaseService.isConfigured()) {
      await this.ensureSeededToSupabase();
      const client = this.supabaseService.getClient();
      const now = new Date().toISOString();
      const nextIndex = this.tracks.length + 1;
      const track: TrackItem = {
        ...input,
        id: `track-${nextIndex}`,
        asset_id: `AST-${String(nextIndex).padStart(4, '0')}`,
        upload_date: now,
        uploaded_by: 'admin-demo',
        preview_duration: 30,
        trending_score: 40,
        download_count: 0,
        verification_id: `VER-${String(nextIndex).padStart(4, '0')}`,
        reviewed_by_admin_id: 'admin-demo',
        reviewed_at: now,
        admin_note: 'Created from admin mock panel',
        rejection_reason: null,
        created_at: now,
        updated_at: now,
        published_at: now,
      };

      const { data, error } = await client.from('tracks').insert(track).select('*').single();
      if (error) throw error;
      return data;
    }

    const now = new Date().toISOString();
    const nextIndex = this.tracks.length + 1;
    const track: TrackItem = {
      ...input,
      id: `track-${nextIndex}`,
      asset_id: `AST-${String(nextIndex).padStart(4, '0')}`,
      upload_date: now,
      uploaded_by: 'admin-demo',
      preview_duration: 30,
      trending_score: 40,
      download_count: 0,
      verification_id: `VER-${String(nextIndex).padStart(4, '0')}`,
      reviewed_by_admin_id: 'admin-demo',
      reviewed_at: now,
      admin_note: 'Created from admin mock panel',
      rejection_reason: null,
      created_at: now,
      updated_at: now,
      published_at: now,
    };

    this.tracks = [track, ...this.tracks];
    return track;
  }
}
