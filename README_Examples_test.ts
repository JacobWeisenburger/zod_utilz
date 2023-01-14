import { z } from 'zod'
import { zu } from './mod.ts'
import { assertEquals } from 'std/testing/asserts.ts'
import { ErrorMapMessageBuilderContext } from './src/makeErrorMap.ts'

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
        zu.SPR( stringSchema.safeParse( undefined ) ).error?.issues[ 0 ].message,
        config.required,
    )
    assertEquals(
        zu.SPR( stringSchema.safeParse( 42 ) ).error?.issues[ 0 ].message,
        config.invalid_type( {
            ...errorCtxMock,
            data: 42
        } ),
    )

    const enumSchema = z.enum( [ 'foo', 'bar' ], { errorMap } )

    assertEquals(
        zu.SPR( enumSchema.safeParse( 'baz' ) ).error?.issues[ 0 ].message,
        config.invalid_enum_value( {
            ...errorCtxMock,
            data: 'baz',
            options: enumSchema.options
        } ),
    )
} )