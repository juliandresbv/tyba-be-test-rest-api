import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FourSquareGateway } from './foursquare.gateway';
import { PlacesSearchProvider } from './places_search/places-search.provider';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [FourSquareGateway, PlacesSearchProvider],
  exports: [PlacesSearchProvider],
})
export class FourSquareModule {}
