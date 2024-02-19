import { z } from 'zod'
import { zu } from '.'
import { mapValues } from './lib/mapValues'
import { pick } from './lib/pick'
import { omit } from './lib/omit'

/**
partialSafeParse allows you to get the valid fields even if there was an error in another field

@example
import { zu } from 'zod_utilz'
const userSchema = z.object( { name: z.string(), age: z.number() } )
const result = zu.partialSafeParse( userSchema, { name: null, age: 42 } )
// {
//     successType: 'partial',
//     validData: { age: 42 },
//     invalidData: { name: null },
// }
result.error?.flatten().fieldErrors
// {
//     name: [ 'Expected string, received null' ],
// }
*/
export function partialSafeParse<Schema extends z.AnyZodObject> (
    schema: Schema, input: unknown
): ReturnType<typeof zu.SPR> & {
    successType: 'full' | 'partial' | 'none',
    validData: Partial<z.infer<Schema>>,
    invalidData: Partial<z.infer<Schema>>,
} {
    const result = zu.SPR( schema.safeParse( input ) )
    if ( result.success ) return {
        ...result,
        successType: 'full',
        validData: result.data as Partial<z.infer<Schema>>,
        invalidData: {},
    } as const

    const { fieldErrors, formErrors } = result.error?.flatten() ?? {}
    if ( formErrors?.length ) return {
        ...result,
        successType: 'none',
        validData: {},
        invalidData: {},
    }

    const inputObj = input as z.infer<Schema>
    const keysWithInvalidData = Object.keys( fieldErrors ?? {} )
    const validInput = omit( inputObj, keysWithInvalidData )
    const invalidData = pick( inputObj, keysWithInvalidData ) as Partial<z.infer<Schema>>

    const validData = schema
        .omit( mapValues( () => true )( fieldErrors ) )
        .parse( validInput ) as Partial<z.infer<Schema>>

    return {
        ...result,
        successType: 'partial',
        validData,
        invalidData,
    }
}