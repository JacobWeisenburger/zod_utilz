import { z } from 'zod'

/* TODO add to docs */
export const dataOr = <Input, Output>
    ( fn: ( error: z.ZodError<Input> ) => any ) =>
    ( result: z.SafeParseReturnType<Input, Output> ) =>
        result.success ? result.data : fn( result.error )