// trade.controller.ts
import { Controller, Get, OnModuleInit, Query } from '@nestjs/common';
import { generateMockDiabloItems } from '../diabloItems/diablo-item.mock';
import { API } from '@sanctuaryteam/shared';
import { Game } from '@diablosnaps/common';
import { DiabloItem } from 'src/diabloItems/diablo-item.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { DiabloItemAffix } from 'src/diabloItems/diablo-item-affix.entity';
import { Repository } from 'typeorm';

export interface SearchRequest {
  payload: API.SearchPayload;
  serverType: Game.ServerType;
}

export interface SearchPageRequest extends SearchRequest {
  timestamp: number;
  page: number;
}

export interface SearchPageResponse {
  results: DiabloItem[];
}

export interface SearchResponse extends SearchPageResponse {
  total: number;
  timestamp: number;
}

@Controller('trade')
export class TradeController implements OnModuleInit {
  private diabloItemsMock: DiabloItem[] = [];

  constructor(
    @InjectRepository(DiabloItemAffix)
    private diabloItemAffixRepository: Repository<DiabloItemAffix>,
  ) {
  }

  async onModuleInit() {
    const diabloItemAffixes = await this.diabloItemAffixRepository.find();
    this.diabloItemsMock = generateMockDiabloItems(500, diabloItemAffixes);
  }

  @Get('search')
  search(@Query() request: SearchPageRequest): SearchResponse {
    const { payload, serverType, timestamp, page } = request;

    // You can implement the actual search logic here based on the request
    // For now, we'll use mock data
    const startIndex = (page - 1) * 10;
    const endIndex = startIndex + 10;
    console.log(startIndex, endIndex)
    const paginatedResults: DiabloItem[] = this.diabloItemsMock.slice(startIndex, endIndex);

    const response: SearchPageResponse = {
      results: paginatedResults,
    };

    const total = this.diabloItemsMock.length;
    return {
      total,
      timestamp,
      ...response,
    };
  }
}
