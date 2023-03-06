export type DatabaseConfig = {
  host: string;
  port: number;
  password: string;
  username: string;
  database: string;
  ca: string;
};

const databaseConfig = (): DatabaseConfig => {
  return {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    password: process.env.DB_PASSWORD,
    username: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    ca: process.env.SSL_CERT,
  };
};

export default databaseConfig;
