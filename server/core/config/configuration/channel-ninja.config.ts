export type ChannelNinjaConfig = {
  username: string;
  password: string;
  forceFetchGraph: boolean;
  sessionSecret: string;
  coinApiKey: string;
  apiUrl: string;
};

const channelNinjaConfig = (): ChannelNinjaConfig => ({
  username: process.env.HTTP_BASIC_USER,
  password: process.env.HTTP_BASIC_PASS,
  forceFetchGraph: Boolean(process.env.FORCE_FETCH_GRAPH) || false,
  sessionSecret: process.env.SESSION_SECRET,
  coinApiKey: process.env.COIN_API_KEY,
  apiUrl: process.env.API_URL,
});

export default channelNinjaConfig;
