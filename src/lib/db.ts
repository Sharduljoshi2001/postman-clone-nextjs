import { MikroORM, EntityManager } from '@mikro-orm/core';
import config from '../db/mikro-orm.config';
//global cache to prevent multiple connections during hot reload in dev mode
const globalForOrm = global as unknown as { orm: MikroORM };
export const getORM = async (): Promise<MikroORM> => {
  if (!globalForOrm.orm) {
    globalForOrm.orm = await MikroORM.init(config);
  }
  return globalForOrm.orm;
};
//helper function to get EntityManager quickly for queries
export const getEM = async (): Promise<EntityManager> => {
  const orm = await getORM();
  return orm.em.fork(); //always fork a new context for each request
};