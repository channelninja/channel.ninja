export const MIN_CHANNELS = process.env.NODE_ENV !== 'production' ? 1 : 20;
export const MAX_CHANNELS = 40;
export const TWO_WEEKS = 60 * 60 * 24 * 7 * 2 * 1000;
export const MIN_DISTANCE = process.env.NODE_ENV !== 'production' ? 1 : 2;
export const MIN_AVG_CHANNEL_SIZE = process.env.NODE_ENV !== 'production' ? 1 : 2_000_000;
