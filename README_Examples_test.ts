import { z } from 'zod'
import { zUtilz } from './src/mod.ts'
import { assertEquals } from 'std/testing/asserts.ts'

Deno.test( 'getErrorMessage', () => {
    const schema = z.string()

    assertEquals(
        zUtilz.getErrorMessage( schema.safeParse( undefined ) ),
        'Required'
    )
} )

Deno.test( 'makeErrorMap', () => {
    const { errorMap, config } = zUtilz.makeErrorMap( {
        required: 'Custom required message',
        invalid_type: ( { data } ) => `${ data } is an invalid type`,
        invalid_enum_value: ( { data, options } ) =>
            `${ data } is not a valid enum value. Valid options: ${ options?.join( ' | ' ) } `,
    } )

    const stringSchema = z.string( { errorMap } )

    assertEquals(
        zUtilz.getErrorMessage( stringSchema.safeParse( undefined ) ),
        config.required,
    )
    assertEquals(
        zUtilz.getErrorMessage( stringSchema.safeParse( 42 ) ),
        config.invalid_type( { data: 42 } ),
    )

    const enumSchema = z.enum( [ 'foo', 'bar' ], { errorMap } )

    assertEquals(
        zUtilz.getErrorMessage( enumSchema.safeParse( 'baz' ) ),
        config.invalid_enum_value( { data: 'baz', options: enumSchema.options } ),
    )
} )