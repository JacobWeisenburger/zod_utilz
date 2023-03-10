import { z } from 'zod'
import type { json } from './JSON.ts' 

const jsonStringSchema = z
  .string()
  .transform((str, ctx): z.infer<ReturnType<typeof json>> => {
    try {
      return JSON.parse(str)
    } catch (e) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid JSON' })
      return z.NEVER
    }
  })

/**
 * Returns a zod parser for any JSON object, encoded as a string.
 */
export const jsonString = () => jsonStringSchema
