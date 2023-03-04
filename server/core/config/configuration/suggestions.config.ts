export type SuggestionsConfig = {
  minChannels: number;
  maxChannels: number;
  minAvgChannelSize: number;
  minDistance: number;
  maxLastUpdatedDurationMS: number;
};

const suggestionsConfig = (): SuggestionsConfig => ({
  minChannels: parseInt(process.env.MIN_CHANNELS, 10) || 20,
  maxChannels: parseInt(process.env.MAX_CHANNELS, 10) || 40,
  minAvgChannelSize: parseInt(process.env.MIN_AVG_CHANNEL_SIZE, 10) || 2_000_000,
  minDistance: parseInt(process.env.MIN_DISTANCE, 10) || 2,
  maxLastUpdatedDurationMS: parseInt(process.env.MAX_LAST_UPDATED_DURATION_MS, 10) || 60 * 60 * 24 * 7 * 2 * 1000, // two weeks
});

export default suggestionsConfig;
