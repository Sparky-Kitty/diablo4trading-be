// trade.controller.ts
import { Game } from '@diablosnaps/common';
import {
  Body,
  Controller,
  Get,
  OnModuleInit,
  Post,
  Query,
} from '@nestjs/common';
import { API } from '@sanctuaryteam/shared';
import { SearchResult } from '@sanctuaryteam/shared/cjs/api/search';
import { DiabloItem } from 'src/diabloItems/diablo-item.interface';
import { DiabloItemService } from 'src/diabloItems/diablo-item.service';
import { generateMockDiabloItems } from '../diabloItems/diablo-item.mock';

@Controller('trade')
export class TradeController implements OnModuleInit {
  private diabloItemsMock: DiabloItem[] = [];

  constructor(private diabloItemService: DiabloItemService) { }

  async onModuleInit() {
    const diabloItemAffixes = await this.diabloItemService.getAffixes();
    this.diabloItemsMock = generateMockDiabloItems(500, diabloItemAffixes);
  }

  @Post('search')
  createSearch(@Body() request: API.SearchPostRequest): API.SearchPostResponse {
    console.info('createSearch', request.payload);
    // TODO: store payload in db and return id
    // same payload should return same id -> hash?
    return {
      payloadId: '1',
      timestamp: Date.now(),
    };
  }

  @Get('search')
  getSearch(
    @Query() request: API.SearchGetRequestParams,
  ): API.SearchGetResponse {
    console.info('getSearch', request);
    // TODO: fetch payload from db and return it
    return {
      payload: {},
    };
  }

  @Get('fetch')
  fetch(@Query() request: API.FetchGetRequestParams): API.FetchGetResponse {
    const { serverType, payloadId, timestamp, page } = request;

    // You can implement the actual search logic here based on the request
    // For now, we'll use mock data
    const startIndex = (page ?? 1 - 1) * 10;
    const endIndex = startIndex + 10;
    console.log(startIndex, endIndex);
    const paginatedResults: DiabloItem[] = this.diabloItemsMock.slice(
      startIndex,
      endIndex,
    );

    const response: API.FetchGetResponse = {
      results: paginatedResults.map<SearchResult>((item) => ({
        item: {
          // should be removed from item interface
          language: undefined,
          quality: item.quality,
          variant: item.variant,
          type: item.type,
          power: item.power,
          requiredLevel: item.requiredLevel,
          classRestriction: item.classRestriction,
          inherentAffixes: [
            { affix: item.inherentAffix0, value: item.inherentAffix0Value },
            { affix: item.inherentAffix1, value: item.inherentAffix1Value },
          ]
            .filter((x) => !isNaN(x.affix?.id))
            .map<Game.ItemAffix>(({ affix, value }) => ({
              id: `${affix.id}`,
              value,
            })),
          affixes: [
            { affix: item.affix0, value: item.affix0Value },
            { affix: item.affix1, value: item.affix1Value },
            { affix: item.affix2, value: item.affix2Value },
            { affix: item.affix3, value: item.affix3Value },
          ]
            .filter((x) => !isNaN(x.affix?.id))
            .map<Game.ItemAffix>(({ affix, value }) => ({
              id: `${affix.id}`,
              value,
            })),
          socketType: item.socketType,
        },
        listing: {
          account: null,
          expiresAt: null,
          id: item.uuid,
        },
      })),
      hasMore: endIndex < this.diabloItemsMock.length,
    };
    return response;
  }
}
