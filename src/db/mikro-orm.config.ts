import { Options, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { RequestHistory } from './entities/RequestHistory';
import * as dotenv from 'dotenv';
dotenv.config();
const config: Options = {
  driver: PostgreSqlDriver,
  dbName: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  entities: [RequestHistory],
  debug: process.env.NODE_ENV !== 'production', //development me query logs dikhayega
  allowGlobalContext: true,
};
export default config;