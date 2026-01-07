import { RequiredEntityData } from '@mikro-orm/core'; // Import added
import { getEM } from '../lib/db';
import { RequestHistory } from '../db/entities/RequestHistory';
//creating a new entry in request history
export const createRequestHistory = async (data: RequiredEntityData<RequestHistory>) => {
  const em = await getEM(); //getting fresh entity manager context
  const requestEntry = em.create(RequestHistory, data);
  em.persist(requestEntry);
  await em.flush();
  return requestEntry;
};
//fetching history with pagination
export const getHistory = async (limit = 10, offset = 0) => {
  const em = await getEM();
  //findAndCount returns both data and total count
  const [items, count] = await em.findAndCount(
    RequestHistory,
    {}, //where clause (empty means all)
    {
      orderBy: { createdAt: 'DESC' }, //latest requests first
      limit: limit,
      offset: offset,
    }
  );
  
  return { items, count };
};