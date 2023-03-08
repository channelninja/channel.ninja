import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import MockedConfigService from 'server/core/config/mock-config.service';
import { EdgeResponseDto } from '../graph/dtos/edge-response.dto';
import { NodeResponseDto } from '../graph/dtos/node-response.dto';
import { GraphService } from '../graph/graph.service';
import { SuggestionsService } from './suggestions.service';

describe('SuggestionsService', () => {
  let service: SuggestionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuggestionsService, ConfigService],
    })
      .overrideProvider(ConfigService)
      .useClass(MockedConfigService)
      .useMocker((token) => {
        const nodes: NodeResponseDto[] = [];
        const edges: EdgeResponseDto[] = [];

        if (token === GraphService) {
          return { getNodes: jest.fn().mockResolvedValue(nodes), getEdges: jest.fn().mockResolvedValue(edges) };
        }
      })
      .compile();

    service = module.get<SuggestionsService>(SuggestionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
