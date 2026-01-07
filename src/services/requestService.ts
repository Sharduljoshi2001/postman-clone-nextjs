import axios from 'axios';
import * as requestRepository from '../repositories/requestRepository';
import { RequestInput } from '../validators/requestValidator';
//core logic to execute the http request and log it
export const executeRequest = async (input: RequestInput) => {
  const startTime = Date.now();
  let responseData: any = {};
  let statusCode = 0;
  let errorMsg = null;
  try {
    //making the actual external http call
    const response = await axios({
      method: input.method,
      url: input.url,
      //Fix: Casting headers to 'any' to bypass strict AxiosHeader type checks
      headers: (input.headers as any) || {},
      data: input.body,
      validateStatus: () => true, 
    });
    responseData = response.data;
    statusCode = response.status;
  } catch (error: any) {
    //handling network errors (e.g., DNS failure, server unreachable)
    errorMsg = error.message || "Network Error";
    statusCode = 500; //internal server error code for network failures
    responseData = { error: errorMsg };
  }
  const duration = Date.now() - startTime;
  //saving this interaction to database asynchronously
  //Using 'as any' for body/headers here is safe because Postgres stores them as JSON
  const historyEntry = await requestRepository.createRequestHistory({
    url: input.url,
    method: input.method,
    body: (input.body as any) || {}, 
    headers: (input.headers as any) || {},
    statusCode: statusCode,
    duration: duration,
    createdAt: new Date(),
  });
  //returning combined result for the controller
  return {
    response: responseData,
    meta: {
      statusCode,
      duration,
      size: JSON.stringify(responseData).length,
    },
    historyId: historyEntry.id
  };
};
//fetching history for the controller (paginated)
export const fetchHistory = async (page: number, limit: number) => {
  const offset = (page - 1) * limit;
  return await requestRepository.getHistory(limit, offset);
};