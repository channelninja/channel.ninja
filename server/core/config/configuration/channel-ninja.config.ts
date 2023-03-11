export type ChannelNinjaConfig = {
  username: string;
  password: string;
  forceFetchGraph: boolean;
  sessionSecret: string;
  coinApiKey: string;
  apiUrl: string;
  txExplorerUrl: string;
  logLevel: string;
  logtailToken?: string;
};

const channelNinjaConfig = (): ChannelNinjaConfig => ({
  username: process.env.HTTP_BASIC_USER,
  password: process.env.HTTP_BASIC_PASS,
  forceFetchGraph: Boolean(process.env.FORCE_FETCH_GRAPH) || false,
  sessionSecret: process.env.SESSION_SECRET,
  coinApiKey: process.env.COIN_API_KEY,
  apiUrl: process.env.API_URL,
  txExplorerUrl: process.env.TX_EXPLORER_URL || 'https://mempool.space/tx',
  logLevel: process.env.LOG_LEVEL || 'trace',
  logtailToken: process.env.LOGTAIL_TOKEN,
});

export default channelNinjaConfig;
