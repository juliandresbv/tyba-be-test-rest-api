import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { FourSquareGateway } from '../foursquare.gateway';
import {
  FSQSearchPlacesCategory,
  FSQSearchPlacesCategoryCode,
} from './enums/places-search.enum';

@Injectable()
export class PlacesSearchProvider {
  constructor(
    @Inject(FourSquareGateway)
    private readonly fourSquareGateway: FourSquareGateway,
  ) {}

  async getRestaurantsNearby(latlong: string, categories: string) {
    const nearbyRestarurants = await this.fourSquareGateway.request(
      {
        generalApiName: 'places',
        specificApiName: 'search',
        version: 'v3',
      },
      {
        categories: categories?.includes(FSQSearchPlacesCategory.RESTAURANT)
          ? FSQSearchPlacesCategoryCode.RESTAURANT
          : '',
        ll: latlong,
      },
    );

    if (!nearbyRestarurants?.data) {
      throw new HttpException(
        'No restaurants nearby found',
        HttpStatus.NOT_FOUND,
      );
    }

    return nearbyRestarurants.data?.results?.map((place) => ({
      location: place?.location,
      name: place?.name,
    }));
  }
}
