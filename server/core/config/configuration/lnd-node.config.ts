export type LndNodeConfig = {
  macaroon: string;
  socket: string;
  cert?: string;
};

const lndNodeConfig = (): LndNodeConfig => ({
  macaroon: process.env.MACAROON,
  socket: process.env.SOCKET,
  cert: process.env.CERT || '',
});

export default lndNodeConfig;
