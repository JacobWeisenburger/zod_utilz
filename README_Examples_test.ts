import { z } from 'zod'
import { zu } from './mod.ts'
import { assertEquals } from 'std/testing/asserts.ts'
import { ErrorMapMessageBuilderContext } from './src/makeErrorMap.ts'

Deno.test( 'getErrorMessage', () => {
    const schema = z.string()

    assertEquals(
        zu.getErrorMessage( schema.safeParse( undefined ) ),
        'Required'
    )
} )

const errorCtxMock = {
    data: 'unknown',
    defaultError: 'Invalid',
    issue: {
        code: 'invalid_type',
        expected: 'unknown',
        received: 'unknown',
        path: [],
    }
} satisfies ErrorMapMessageBuilderContext

Deno.test( 'makeErrorMap', () => {
    const { errorMap, config } = zu.makeErrorMap( {
        required: 'Custom required message',
        invalid_type: ( { data } ) => `${ data } is an invalid type`,
        invalid_enum_value: ( { data, options } ) =>
            `${ data } is not a valid enum value. Valid options: ${ options?.join( ' | ' ) } `,
    } )

    const stringSchema = z.string( { errorMap } )

    assertEquals(
        zu.getErrorMessage( stringSchema.safeParse( undefined ) ),
        config.required,
    )
    assertEquals(
        zu.getErrorMessage( stringSchema.safeParse( 42 ) ),
        config.invalid_type( {
            ...errorCtxMock,
            data: 42
        } ),
    )

    const enumSchema = z.enum( [ 'foo', 'bar' ], { errorMap } )

    assertEquals(
        zu.getErrorMessage( enumSchema.safeParse( 'baz' ) ),
        config.invalid_enum_value( {
            ...errorCtxMock,
            data: 'baz',
            options: enumSchema.options
        } ),
    )
} )