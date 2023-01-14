import { z } from 'zod'
import { zu } from '../mod.ts'
import { assertEquals } from 'std/testing/asserts.ts'

const { errorMap, config } = zu.makeErrorMap( {
    required: 'required',
    invalid_type: 'invalid_type',
    too_small: () => 'too_small',
    too_big: () => 'too_big',
    invalid_string: () => 'invalid_string',
    not_multiple_of: () => 'not_multiple_of',
    not_finite: () => 'not_finite',
    invalid_enum_value: () => 'invalid_enum_value',
} )

Deno.test( 'z.string( { errorMap } )', () => {
    const schema = z.string( { errorMap } ).min( 3 ).max( 5 )

    assertEquals(
        zu.SPR( schema.safeParse( 'foo' ) ).data,
        'foo'
    )
    assertEquals(
        zu.SPR( schema.safeParse( undefined ) ).error?.issues[ 0 ].message,
        config.required,
    )
    assertEquals(
        zu.SPR( schema.safeParse( 42 ) ).error?.issues[ 0 ].message,
        config.invalid_type,
    )
    assertEquals(
        zu.SPR( schema.safeParse( [ 'foo' ] ) ).error?.issues[ 0 ].message,
        config.invalid_type,
    )
    assertEquals(
        zu.SPR( schema.safeParse( 'ha' ) ).error?.issues[ 0 ].message,
        config.too_small(),
    )
    assertEquals(
        zu.SPR( schema.safeParse( 'hello world' ) ).error?.issues[ 0 ].message,
        config.too_big(),
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
        config.required,
    )
    assertEquals(
        zu.SPR( schema.safeParse( 'foo' ) ).error?.issues[ 0 ].message,
        config.invalid_type,
    )
    assertEquals(
        zu.SPR( schema.safeParse( [ 42 ] ) ).error?.issues[ 0 ].message,
        config.invalid_type,
    )
    assertEquals(
        zu.SPR( schema.safeParse( 2 ) ).error?.issues[ 0 ].message,
        config.too_small(),
    )
    assertEquals(
        zu.SPR( schema.safeParse( 6 ) ).error?.issues[ 0 ].message,
        config.too_big(),
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
        config.required,
    )
    assertEquals(
        zu.SPR( schema.safeParse( 42 ) ).error?.issues[ 0 ].message,
        config.invalid_type,
    )
    assertEquals(
        zu.SPR( schema.safeParse( [ 'foo' ] ) ).error?.issues[ 0 ].message,
        config.invalid_type,
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
        config.required,
    )
    assertEquals(
        zu.SPR( schema.safeParse( '2023-01-13' ) ).error?.issues[ 0 ].message,
        config.invalid_type,
    )
    assertEquals(
        zu.SPR( schema.safeParse( null ) ).error?.issues[ 0 ].message,
        config.invalid_type,
    )
} )