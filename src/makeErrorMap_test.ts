import { z } from 'zod'
import { assertEquals } from 'std/testing/asserts.ts'
import { zUtilz } from './mod.ts'

const { errorMap, config } = zUtilz.makeErrorMap( {
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
        zUtilz.safeParseResult( schema.safeParse( 'foo' ) ).data,
        'foo'
    )
    assertEquals(
        zUtilz.getErrorMessage( schema.safeParse( undefined ) ),
        config.required,
    )
    assertEquals(
        zUtilz.getErrorMessage( schema.safeParse( 42 ) ),
        config.invalid_type,
    )
    assertEquals(
        zUtilz.getErrorMessage( schema.safeParse( [ 'foo' ] ) ),
        config.invalid_type,
    )
    assertEquals(
        zUtilz.getErrorMessage( schema.safeParse( 'ha' ) ),
        config.too_small(),
    )
    assertEquals(
        zUtilz.getErrorMessage( schema.safeParse( 'hello world' ) ),
        config.too_big(),
    )
} )

Deno.test( 'z.number( { errorMap } )', () => {
    const schema = z.number( { errorMap } ).min( 3 ).max( 5 )

    assertEquals(
        zUtilz.safeParseResult( schema.safeParse( 3 ) ).data,
        3
    )
    assertEquals(
        zUtilz.getErrorMessage( schema.safeParse( undefined ) ),
        config.required,
    )
    assertEquals(
        zUtilz.getErrorMessage( schema.safeParse( 'foo' ) ),
        config.invalid_type,
    )
    assertEquals(
        zUtilz.getErrorMessage( schema.safeParse( [ 42 ] ) ),
        config.invalid_type,
    )
    assertEquals(
        zUtilz.getErrorMessage( schema.safeParse( 2 ) ),
        config.too_small(),
    )
    assertEquals(
        zUtilz.getErrorMessage( schema.safeParse( 6 ) ),
        config.too_big(),
    )
} )

Deno.test( `z.enum( [ 'foo', 'bar', 'baz' ], { errorMap } )`, () => {
    const schema = z.enum( [ 'foo', 'bar', 'baz' ], { errorMap } )

    assertEquals(
        zUtilz.safeParseResult( schema.safeParse( 'foo' ) ).data,
        'foo'
    )
    assertEquals(
        zUtilz.getErrorMessage( schema.safeParse( undefined ) ),
        config.required,
    )
    assertEquals(
        zUtilz.getErrorMessage( schema.safeParse( 42 ) ),
        config.invalid_type,
    )
    assertEquals(
        zUtilz.getErrorMessage( schema.safeParse( [ 'foo' ] ) ),
        config.invalid_type,
    )
} )

Deno.test( 'z.date( { errorMap } )', () => {
    const schema = z.date( { errorMap } )

    const now = new Date
    assertEquals(
        zUtilz.safeParseResult( schema.safeParse( now ) ).data,
        now
    )
    assertEquals(
        zUtilz.getErrorMessage( schema.safeParse( undefined ) ),
        config.required,
    )
    assertEquals(
        zUtilz.getErrorMessage( schema.safeParse( '2023-01-13' ) ),
        config.invalid_type,
    )
    assertEquals(
        zUtilz.getErrorMessage( schema.safeParse( null ) ),
        config.invalid_type,
    )
} )