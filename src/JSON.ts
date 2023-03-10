import { z } from 'zod'

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);

type Literal = z.infer<typeof literalSchema>;

export type Json = Literal | { [key: string]: Json } | Json[];

const jsonSchema = z.lazy(() =>z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

/**
 * Parses a JavaScript object that is JSON-compatible. This includes `string`,
 * `number`, `boolean`, and `null`, plus `Array`s and `Object`s containing
 * JSON-comaptible types as values.
 * 
 * Note: `JSON.stringify()` enforces non-circularity, but this can't be easily
 * checked without actually stringifying the results, which can be slow.
 * 
 * ### Usage:
 * ```
 * import { zu } from 'zod_utilz'
 * const schema = z.json()
 * const result = schema.parse({ some: ['json', 'object'] })
 * ```
*/
export const json = () => jsonSchema
