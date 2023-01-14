import { z } from 'zod'
import { zu } from '../mod.ts'

/**
 * SPR stands for SafeParseResult
 * 
 * This enables [optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) or [nullish coalescing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing) for `z.SafeParseReturnType`.
 * 
 * ### Usage:
 * ```
 * import { zu } from 'zod_utilz'
 * const schema = z.object( { foo: z.string() } )
 * const result = zu.SPR( schema.safeParse( { foo: 42 } ) )
 * const fooDataOrErrors = result.data?.foo ?? result.error?.format().foo?._errors
 * ```
*/
export function SPR<Input, Output> ( result: z.SafeParseReturnType<Input, Output> ) {
    return result.success
        ? { ...result, error: undefined }
        : { ...result, data: undefined }
}