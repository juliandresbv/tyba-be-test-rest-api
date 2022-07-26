import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { URL } from 'url';

@Injectable()
export class FourSquareGateway {
  constructor(
    @Inject(HttpService)
    private readonly httpService: HttpService,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {}

  async request(apiMetadata: any, args: any) {
    try {
      const { generalApiName, specificApiName, version } = apiMetadata || {};

      const baseUrl = new URL(
        `https://api.foursquare.com/${version}/${generalApiName}/${specificApiName}`,
      );

      for (const [key, value] of Object.entries(args)) {
        baseUrl.searchParams.append(key, value as string);
      }

      const result = await this.httpService
        .get(baseUrl.toString(), {
          headers: {
            Authorization: this.configService.get('FSQ_API_KEY'),
          },
        })
        .toPromise();

      if (result?.status < 200 || result?.status > 299) {
        throw new HttpException(
          `API Error: ${result?.data}`,
          HttpStatus.NOT_FOUND,
        );
      }

      return result;
    } catch (error) {
      throw error;
    }
  }
}
