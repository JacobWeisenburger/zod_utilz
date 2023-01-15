import { z } from 'zod'
import { mapValues, omit, pick } from 'lodash'
import { zu } from '../mod.ts'

export function partialSafeParse<Schema extends z.ZodObject<any>> (
    schema: Schema, input: unknown
) {
    const result = zu.SPR( schema.safeParse( input ) )
    if ( result.success ) return result

    const { fieldErrors, formErrors } = result.error.flatten()
    if ( formErrors.length ) return result

    const inputObj = input as z.infer<Schema>
    const keysWithInvalidData = Object.keys( fieldErrors )
    const validInput = omit( inputObj, keysWithInvalidData )
    const invalidData = pick( inputObj, keysWithInvalidData )

    const validData = schema
        .omit( mapValues( fieldErrors, () => true as const ) )
        .parse( validInput )

    return {
        success: 'partial',
        validData,
        invalidData,
        fieldErrors,
    }
}