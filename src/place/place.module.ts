import { Module } from '@nestjs/common';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';
import { FourSquareModule } from '../providers/apis/foursquare_api/foursquare.module';

@Module({
  imports: [FourSquareModule],
  controllers: [PlaceController],
  providers: [PlaceService],
})
export class PlaceModule {}
