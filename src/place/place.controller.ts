import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/providers/jwt-auth.guard';
import { PlaceService } from './place.service';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
@Controller('places')
export class PlaceController {
  constructor(
    @Inject(PlaceService)
    private readonly placeService: PlaceService,
  ) {}

  /**
   * @description -- getRestaurantsNearby gets the nearby restaurants given a location (latitude & longitude)
   * @param -- latlong coma-separated latitude & longitude (ex.: '4.6575715,-74.1122502')
   * @param -- categories coma-separated categories (ex.: 'restaurant')
   * @returns -- nearby restaurants
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('token')
  @ApiQuery({
    name: 'latlong',
    type: String,
    example: '4.6575715,-74.1122502',
  })
  @ApiQuery({
    name: 'categories',
    type: String,
    example: 'restaurant',
  })
  async getRestaurantsNearby(
    @Query('latlong') latlong: string,
    @Query('categories') categories: string,
  ) {
    return this.placeService.getRestaurantsNearby(latlong, categories);
  }
}
