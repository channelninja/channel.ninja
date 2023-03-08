import { ChannelNinjaConfig } from './configuration/channel-ninja.config';
import { Configuration } from './configuration/configuration.enum';
import { DatabaseConfig } from './configuration/database.config';
import { LndNodeConfig } from './configuration/lnd-node.config';
import { SuggestionsConfig } from './configuration/suggestions.config';
import { Environment } from './environment.enum';

const mockedChannelNinjaConfig: ChannelNinjaConfig = {
  username: 'username',
  password: 'password',
  forceFetchGraph: false,
  sessionSecret: 'secret',
  coinApiKey: '1234',
  apiUrl: 'http://localhost:3001',
  txExplorerUrl: 'https://mempool.space/tx',
  logLevel: 'trace',
};

const mockedDatabaseConfig: DatabaseConfig = {
  host: '127.0.0.1',
  port: 5432,
  password: 'password',
  username: 'user',
  database: 'db',
  ca: 'cert',
};

const mockedLndNodeConfig: LndNodeConfig = {
  macaroon: 'macaroon',
  socket: 'socket',
  cert: '',
};

const mockedSuggestionConfig: SuggestionsConfig = {
  minChannels: 20,
  maxChannels: 40,
  minAvgChannelSize: 2_000_000,
  minDistance: 2,
  maxLastUpdatedDurationMS: 60 * 60 * 24 * 7 * 2 * 1000, // two weeks
};

class MockedConfigService {
  public get(
    key: Configuration,
  ): ChannelNinjaConfig | DatabaseConfig | LndNodeConfig | SuggestionsConfig | Environment | undefined {
    switch (key) {
      case Configuration.channelNinja:
        return mockedChannelNinjaConfig;
      case Configuration.database:
        return mockedDatabaseConfig;
      case Configuration.lndNode:
        return mockedLndNodeConfig;
      case Configuration.suggestions:
        return mockedSuggestionConfig;
      case Configuration['NODE_ENV']:
        return Environment.Production;
      default:
        return undefined;
    }
  }
}

export default MockedConfigService;
