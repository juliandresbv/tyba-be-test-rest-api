import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/providers/jwt-auth.guard';
import { PlaceService } from './place.service';

@Controller('places')
export class PlaceController {
  constructor(
    @Inject(PlaceService)
    private readonly placeService: PlaceService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getRestaurantsNearby(
    @Query('latlong') latlong: string,
    @Query('categories') categories: string,
  ) {
    return this.placeService.getRestaurantsNearby(latlong, categories);
  }
}
