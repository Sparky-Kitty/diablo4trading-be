// trade.controller.ts
import { Game } from '@diablosnaps/common';
import {
  Body,
  Controller,
  Get,
  HttpException,
  OnModuleInit,
  Param,
  Post,
  Query
} from '@nestjs/common';
import { API } from '@sanctuaryteam/shared';
import { DiabloItem } from 'src/diabloItems/diablo-item.interface';
import { DiabloItemService } from 'src/diabloItems/diablo-item.service';
import { generateMockDiabloItems } from '../diabloItems/diablo-item.mock';

// https://stackoverflow.com/a/52171480/114157
function cyrb53(value: string, seed = 0): number {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch: number; i < value.length; i++) {
    ch = value.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

@Controller('trade')
export class TradeController implements OnModuleInit {
  private diabloItemsMock: DiabloItem[] = [];

  // TODO: store searches in db
  private cache: Record<string, API.TradeSearch> = {};

  constructor(private diabloItemService: DiabloItemService) { }

  async onModuleInit() {
    const diabloItemAffixes = await this.diabloItemService.getAffixes();
    this.diabloItemsMock = generateMockDiabloItems(500, diabloItemAffixes);
  }

  @Get('fetch')
  fetch(@Query() query: API.TradeFetchGetQuery): API.TradeFetchGetResponse {
    const { serverType, searchId, timestamp, page } = query;
    if (
      typeof serverType === 'undefined' ||
      typeof searchId === 'undefined' ||
      typeof timestamp === 'undefined' ||
      typeof page === 'undefined'
    ) {
      throw new HttpException('Invalid query', 400);
    }
    if (!Game.ServerType[serverType]) {
      throw new HttpException('Invalid serverType', 400);
    }
    if (!this.cache[query.searchId]) {
      throw new HttpException('Invalid searchId', 400);
    }

    // You can implement the actual search logic here based on the request
    // For now, we'll use mock data
    const startIndex = (page ?? 1 - 1) * 10;
    const endIndex = startIndex + 10;
    console.log(startIndex, endIndex);
    const paginatedResults: DiabloItem[] = this.diabloItemsMock.slice(
      startIndex,
      endIndex,
    );

    const response: API.TradeFetchGetResponse = {
      results: paginatedResults.map<API.TradeFetchResult>((item) => ({
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

  @Get('search/:searchId')
  getSearch(
    @Param() params: API.TradeSearchGetParams,
  ): API.TradeSearchGetResponse {
    console.info('getSearch', params);
    const { searchId } = params;
    // TODO: fetch search from db and return it
    if (!this.cache[searchId]) {
      throw new HttpException('Search not found', 404);
    }
    return this.cache[searchId];
  }

  @Post('search')
  createSearch(
    @Body() body: API.TradeSearchCreateBody,
  ): API.TradeSearchCreateResponse {
    console.info('createSearch', body);
    // TODO: store search in db and return id
    // same search should return same id -> hash?
    const searchId = `${cyrb53(JSON.stringify(body))}`;
    this.cache[searchId] = body;
    return {
      searchId,
      timestamp: Date.now(),
    };
  }
}
