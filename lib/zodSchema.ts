import * as z from "zod";
  
  export const artikelSchema = z.object({
    title: z.string().min(3),
    content: z.string().min(10),
  });