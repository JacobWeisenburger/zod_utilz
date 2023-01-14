import { z } from 'zod'
import { zu } from '../mod.ts'
import { assertEquals } from 'std/testing/asserts.ts'
import { ErrorCode, ErrorMapMessageBuilderContext } from "./makeErrorMap.ts"

const config = {
    required: ctx => 'required',
    invalid_type: ctx => 'invalid_type',
    too_small: ctx => 'too_small',
    too_big: ctx => 'too_big',
    invalid_string: ctx => 'invalid_string',
    not_multiple_of: ctx => 'not_multiple_of',
    not_finite: ctx => 'not_finite',
    invalid_enum_value: ctx => 'invalid_enum_value',
    invalid_union_discriminator: ctx => 'invalid_union_discriminator',
} satisfies Parameters<typeof zu.makeErrorMap>[ 0 ]

const errorMap = zu.makeErrorMap( config )

const errorCtxMock = {
    data: 'unknown',
    defaultError: 'Invalid',
    code: 'invalid_type',
    expected: 'unknown',
    received: 'unknown',
    path: [],
} satisfies ErrorMapMessageBuilderContext<ErrorCode>

Deno.test( 'z.string( { errorMap } )', () => {
    const schema = z.string( { errorMap } ).min( 3 ).max( 5 )

    assertEquals(
        zu.SPR( schema.safeParse( 'foo' ) ).data,
        'foo'
    )
    assertEquals(
        zu.SPR( schema.safeParse( undefined ) ).error?.issues[ 0 ].message,
        config.required( {
            ...errorCtxMock,
            code: 'required',
            received: 'undefined',
        } ),
    )
    assertEquals(
        zu.SPR( schema.safeParse( 42 ) ).error?.issues[ 0 ].message,
        config.invalid_type( errorCtxMock ),
    )
    assertEquals(
        zu.SPR( schema.safeParse( [ 'foo' ] ) ).error?.issues[ 0 ].message,
        config.invalid_type( errorCtxMock ),
    )
    assertEquals(
        zu.SPR( schema.safeParse( 'ha' ) ).error?.issues[ 0 ].message,
        config.too_small( {
            ...errorCtxMock,
            code: 'too_small',
            type: 'string',
            inclusive: true,
            minimum: 3,
        } ),
    )
    assertEquals(
        zu.SPR( schema.safeParse( 'hello world' ) ).error?.issues[ 0 ].message,
        config.too_big( {
            ...errorCtxMock,
            code: 'too_big',
            type: 'string',
            inclusive: true,
            maximum: 5,
        } ),
    )
} )

Deno.test( 'z.number( { errorMap } )', () => {
    const schema = z.number( { errorMap } ).min( 3 ).max( 5 )

    assertEquals(
        zu.SPR( schema.safeParse( 3 ) ).data,
        3
    )
    assertEquals(
        zu.SPR( schema.safeParse( undefined ) ).error?.issues[ 0 ].message,
        config.required( {
            ...errorCtxMock,
            code: 'required',
            received: 'undefined',
        } ),
    )
    assertEquals(
        zu.SPR( schema.safeParse( 'foo' ) ).error?.issues[ 0 ].message,
        config.invalid_type( errorCtxMock ),
    )
    assertEquals(
        zu.SPR( schema.safeParse( [ 42 ] ) ).error?.issues[ 0 ].message,
        config.invalid_type( errorCtxMock ),
    )
    assertEquals(
        zu.SPR( schema.safeParse( 2 ) ).error?.issues[ 0 ].message,
        config.too_small( {
            ...errorCtxMock,
            code: 'too_small',
            type: 'number',
            inclusive: true,
            minimum: 3,
        } ),
    )
    assertEquals(
        zu.SPR( schema.safeParse( 6 ) ).error?.issues[ 0 ].message,
        config.too_big( {
            ...errorCtxMock,
            code: 'too_big',
            type: 'number',
            inclusive: true,
            maximum: 5,
        } ),
    )
} )

Deno.test( `z.enum( [ 'foo', 'bar', 'baz' ], { errorMap } )`, () => {
    const schema = z.enum( [ 'foo', 'bar', 'baz' ], { errorMap } )

    assertEquals(
        zu.SPR( schema.safeParse( 'foo' ) ).data,
        'foo'
    )
    assertEquals(
        zu.SPR( schema.safeParse( undefined ) ).error?.issues[ 0 ].message,
        config.required( {
            ...errorCtxMock,
            code: 'required',
            received: 'undefined',
        } ),
    )
    assertEquals(
        zu.SPR( schema.safeParse( 42 ) ).error?.issues[ 0 ].message,
        config.invalid_type( errorCtxMock ),
    )
    assertEquals(
        zu.SPR( schema.safeParse( [ 'foo' ] ) ).error?.issues[ 0 ].message,
        config.invalid_type( errorCtxMock ),
    )
} )

Deno.test( 'z.date( { errorMap } )', () => {
    const schema = z.date( { errorMap } )

    const now = new Date
    assertEquals(
        zu.SPR( schema.safeParse( now ) ).data,
        now
    )
    assertEquals(
        zu.SPR( schema.safeParse( undefined ) ).error?.issues[ 0 ].message,
        config.required( {
            ...errorCtxMock,
            code: 'required',
            received: 'undefined',
        } ),
    )
    assertEquals(
        zu.SPR( schema.safeParse( '2023-01-13' ) ).error?.issues[ 0 ].message,
        config.invalid_type( errorCtxMock ),
    )
    assertEquals(
        zu.SPR( schema.safeParse( null ) ).error?.issues[ 0 ].message,
        config.invalid_type( errorCtxMock ),
    )
} )

Deno.test( 'README Example', () => {
    const config = {
        required: 'Custom required message',
        invalid_type: ( { code, data } ) => `${ data } is an invalid type`,
        invalid_enum_value: ( { data, options } ) =>
            `${ data } is not a valid enum value. Valid options: ${ options?.join( ' | ' ) } `,
    } satisfies Parameters<typeof zu.makeErrorMap>[ 0 ]

    const errorMap = zu.makeErrorMap( config )

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
            code: 'invalid_enum_value',
            options: enumSchema.options
        } ),
    )
} )