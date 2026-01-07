import { z } from 'zod';
//schema to validate incoming http request details
export const requestSchema = z.object({
  url: z.string().refine((val) => {
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  }, { message: "Invalid URL format" }), //must be a valid url
  method: z.enum(["GET", "POST", "PUT", "DELETE"]), //restricted to these methods only
  //defining key as string and value as any
  body: z.record(z.string(), z.any()).optional().nullable(), 
  
  //explicitly defining key as string and value as any
  headers: z.record(z.string(), z.any()).optional().nullable(), 
});
//type inference for typescript usage in services
export type RequestInput = z.infer<typeof requestSchema>;