import { Inject, Injectable } from '@nestjs/common';
import { PlacesSearchProvider } from '../providers/apis/foursquare_api/places_search/places-search.provider';

@Injectable()
export class PlaceService {
  constructor(
    @Inject(PlacesSearchProvider)
    private readonly searchPlacesProvider: PlacesSearchProvider,
  ) {}

  async getRestaurantsNearby(latlong: string, categories: string) {
    return this.searchPlacesProvider.getRestaurantsNearby(latlong, categories);
  }
}
