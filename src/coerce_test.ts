import { z } from 'zod'
import { zu } from '../mod.ts'
import { assertEquals, assertThrows, assert } from 'std/testing/asserts.ts'

Deno.test( 'coerce( z.string() )', () => {
    const schema = zu.coerce( z.string() )

    /* primitives */
    assertEquals( schema.parse( 'foo' ), 'foo' )
    assertEquals( schema.parse( 42 ), '42' )
    assertEquals( schema.parse( 42n ), '42' )
    assertEquals( schema.parse( true ), 'true' )
    assertEquals( schema.parse( false ), 'false' )
    assertEquals( schema.parse( undefined ), 'undefined' )
    assertEquals( schema.parse( Symbol( 'symbol' ) ), 'Symbol(symbol)' )
    assertEquals( schema.parse( null ), 'null' )

    /* objects */
    assertEquals( schema.parse( {} ), '{}' )
    assertEquals( schema.parse( { foo: 'foo' } ), '{"foo":"foo"}' )
    assertEquals( schema.parse( { foo: 'foo', bar: 'bar' } ), '{"foo":"foo","bar":"bar"}' )
    assertEquals( schema.parse( [] ), '[]' )
    assertEquals( schema.parse( [ 'foo' ] ), '["foo"]' )
    assertEquals( schema.parse( [ 'foo', 'bar' ] ), '["foo","bar"]' )
    assert( schema.parse( () => { } ) )
    assert( schema.parse( ( arg: any ) => { } ) )
    assert( schema.parse( ( arg1: any, arg2: any ) => { } ) )
} )

Deno.test( 'coerce( z.number() )', () => {
    const schema = zu.coerce( z.number() )

    /* primitives */
    assertThrows( () => schema.parse( 'foo' ) )
    assertEquals( schema.parse( '42' ), 42 )
    assertEquals( schema.parse( 42 ), 42 )
    assertEquals( schema.parse( 42n ), 42 )
    assertEquals( schema.parse( true ), 1 )
    assertEquals( schema.parse( false ), 0 )
    assertThrows( () => schema.parse( undefined ) )
    assertThrows( () => schema.parse( Symbol( 'symbol' ) ) )
    assertThrows( () => schema.parse( null ) )

    /* objects */
    assertThrows( () => schema.parse( {} ) )
    assertThrows( () => schema.parse( { foo: 'foo' } ) )
    assertThrows( () => schema.parse( { foo: 'foo', bar: 'bar' } ) )
    assertThrows( () => schema.parse( [] ) )
    assertThrows( () => schema.parse( [ 'foo' ] ) )
    assertThrows( () => schema.parse( [ 'foo', 'bar' ] ) )
    assertThrows( () => schema.parse( () => { } ) )
    assertThrows( () => schema.parse( ( arg: any ) => { } ) )
    assertThrows( () => schema.parse( ( arg1: any, arg2: any ) => { } ) )
} )

Deno.test( 'coerce( z.bigint() )', () => {
    const schema = zu.coerce( z.bigint() )

    /* primitives */
    assertThrows( () => schema.parse( 'foo' ) )
    assertEquals( schema.parse( '42' ), 42n )
    assertEquals( schema.parse( '42n' ), 42n )
    assertEquals( schema.parse( 42 ), 42n )
    assertEquals( schema.parse( 42n ), 42n )
    assertEquals( schema.parse( true ), 1n )
    assertEquals( schema.parse( false ), 0n )
    assertThrows( () => schema.parse( undefined ) )
    assertThrows( () => schema.parse( Symbol( 'symbol' ) ) )
    assertThrows( () => schema.parse( null ) )

    /* objects */
    assertThrows( () => schema.parse( {} ) )
    assertThrows( () => schema.parse( { foo: 'foo' } ) )
    assertThrows( () => schema.parse( { foo: 'foo', bar: 'bar' } ) )
    assertThrows( () => schema.parse( [] ) )
    assertThrows( () => schema.parse( [ 'foo' ] ) )
    assertThrows( () => schema.parse( [ 'foo', 'bar' ] ) )
    assertThrows( () => schema.parse( () => { } ) )
    assertThrows( () => schema.parse( ( arg: any ) => { } ) )
    assertThrows( () => schema.parse( ( arg1: any, arg2: any ) => { } ) )
} )

Deno.test( 'coerce( z.boolean() )', () => {
    const schema = zu.coerce( z.boolean() )

    /* primitives */
    assertEquals( schema.parse( 'false' ), false )
    assertEquals( schema.parse( 'true' ), true )
    assertEquals( schema.parse( 'foo' ), true )
    assertEquals( schema.parse( 0 ), false )
    assertEquals( schema.parse( 42 ), true )
    assertEquals( schema.parse( 42n ), true )
    assertEquals( schema.parse( true ), true )
    assertEquals( schema.parse( false ), false )
    assertEquals( schema.parse( undefined ), false )
    assertEquals( schema.parse( Symbol( 'symbol' ) ), true )
    assertEquals( schema.parse( null ), false )

    /* objects */
    assertEquals( schema.parse( {} ), true )
    assertEquals( schema.parse( { foo: 'foo' } ), true )
    assertEquals( schema.parse( { foo: 'foo', bar: 'bar' } ), true )
    assertEquals( schema.parse( [] ), true )
    assertEquals( schema.parse( [ 'foo' ] ), true )
    assertEquals( schema.parse( [ 'foo', 'bar' ] ), true )
    assertEquals( schema.parse( () => { } ), true )
    assertEquals( schema.parse( ( arg: any ) => { } ), true )
    assertEquals( schema.parse( ( arg1: any, arg2: any ) => { } ), true )
} )

Deno.test( 'coerce( z.any().array() )', () => {
    const schema = zu.coerce( z.any().array() )

    /* primitives */
    assertEquals( schema.parse( 'foo' ), [ 'foo' ] )
    assertEquals( schema.parse( 42 ), [ 42 ] )
    assertEquals( schema.parse( 42n ), [ 42n ] )
    assertEquals( schema.parse( true ), [ true ] )
    assertEquals( schema.parse( false ), [ false ] )
    assertEquals( schema.parse( undefined ), [ undefined ] )
    assertEquals( schema.parse( null ), [ null ] )

    const symbol = Symbol( 'symbol' )
    assertEquals( schema.parse( symbol ), [ symbol ] )

    /* objects */
    assertEquals( schema.parse( {} ), [ {} ] )
    assertEquals( schema.parse( { foo: 'foo' } ), [ { foo: 'foo' } ] )
    assertEquals( schema.parse( { foo: 'foo', bar: 'bar' } ), [ { foo: 'foo', bar: 'bar' } ] )
    assertEquals( schema.parse( [] ), [] )
    assertEquals( schema.parse( [ 'foo' ] ), [ 'foo' ] )
    assertEquals( schema.parse( [ 'foo', 'bar' ] ), [ 'foo', 'bar' ] )

    const fn1 = () => { }
    assertEquals( schema.parse( fn1 ), [ fn1 ] )

    const fn2 = ( arg: any ) => { }
    assertEquals( schema.parse( fn2 ), [ fn2 ] )

    const fn3 = ( arg1: any, arg2: any ) => { }
    assertEquals( schema.parse( fn3 ), [ fn3 ] )
} )

Deno.test( 'coerce( z.string().array() )', () => {
    const schema = zu.coerce( z.string().array() )

    /* primitives */
    assertEquals( schema.parse( 'foo' ), [ 'foo' ] )
    assertEquals( schema.parse( 42 ), [ '42' ] )
    assertEquals( schema.parse( 42n ), [ '42' ] )
    assertEquals( schema.parse( true ), [ 'true' ] )
    assertEquals( schema.parse( false ), [ 'false' ] )
    assertEquals( schema.parse( undefined ), [ 'undefined' ] )
    assertEquals( schema.parse( null ), [ 'null' ] )

    const symbol = Symbol( 'symbol' )
    assertEquals( schema.parse( symbol ), [ symbol.toString() ] )

    /* objects */
    assertEquals( schema.parse( {} ), [ '{}' ] )
    assertEquals( schema.parse( { foo: 'foo' } ), [ '{"foo":"foo"}' ] )
    assertEquals( schema.parse( { foo: 'foo', bar: 'bar' } ), [ '{"foo":"foo","bar":"bar"}' ] )
    assertEquals( schema.parse( [] ), [] )
    assertEquals( schema.parse( [ 'foo' ] ), [ 'foo' ] )
    assertEquals( schema.parse( [ 'foo', 'bar' ] ), [ 'foo', 'bar' ] )
    assertEquals( schema.parse( [ 'foo', '42' ] ), [ 'foo', '42' ] )
    assertEquals( schema.parse( [ '42', '42' ] ), [ '42', '42' ] )
    assert( schema.parse( () => { } ) )
    assert( schema.parse( ( arg: any ) => { } ) )
    assert( schema.parse( ( arg1: any, arg2: any ) => { } ) )
} )

Deno.test( 'coerce( z.number().array() )', () => {
    const schema = zu.coerce( z.number().array() )

    /* primitives */
    assertThrows( () => schema.parse( 'foo' ) )
    assertEquals( schema.parse( '42' ), [ 42 ] )
    assertEquals( schema.parse( 42 ), [ 42 ] )
    assertEquals( schema.parse( 42n ), [ 42 ] )
    assertEquals( schema.parse( true ), [ 1 ] )
    assertEquals( schema.parse( false ), [ 0 ] )
    assertThrows( () => schema.parse( undefined ) )
    assertThrows( () => schema.parse( Symbol( 'symbol' ) ) )
    assertThrows( () => schema.parse( null ) )

    /* objects */
    assertThrows( () => schema.parse( {} ) )
    assertThrows( () => schema.parse( { foo: 'foo' } ) )
    assertThrows( () => schema.parse( { foo: 'foo', bar: 'bar' } ) )
    assertEquals( schema.parse( [] ), [] )
    assertThrows( () => schema.parse( [ 'foo' ] ) )
    assertThrows( () => schema.parse( [ 'foo', 'bar' ] ) )
    assertThrows( () => schema.parse( [ 'foo', '42' ] ) )
    assertEquals( schema.parse( [ '42', '42' ] ), [ 42, 42 ] )
    assertThrows( () => schema.parse( () => { } ) )
    assertThrows( () => schema.parse( ( arg: any ) => { } ) )
    assertThrows( () => schema.parse( ( arg1: any, arg2: any ) => { } ) )
} )

Deno.test( 'coerce( z.bigint().array() )', () => {
    const schema = zu.coerce( z.bigint().array() )

    /* primitives */
    assertThrows( () => schema.parse( 'foo' ) )
    assertEquals( schema.parse( '42' ), [ 42n ] )
    assertEquals( schema.parse( '42n' ), [ 42n ] )
    assertEquals( schema.parse( 42 ), [ 42n ] )
    assertEquals( schema.parse( 42n ), [ 42n ] )
    assertEquals( schema.parse( true ), [ 1n ] )
    assertEquals( schema.parse( false ), [ 0n ] )
    assertThrows( () => schema.parse( undefined ) )
    assertThrows( () => schema.parse( Symbol( 'symbol' ) ) )
    assertThrows( () => schema.parse( null ) )

    /* objects */
    assertThrows( () => schema.parse( {} ) )
    assertThrows( () => schema.parse( { foo: 'foo' } ) )
    assertThrows( () => schema.parse( { foo: 'foo', bar: 'bar' } ) )
    assertEquals( schema.parse( [] ), [] )
    assertThrows( () => schema.parse( [ 'foo' ] ) )
    assertThrows( () => schema.parse( [ 'foo', 'bar' ] ) )
    assertThrows( () => schema.parse( [ 'foo', '42' ] ) )
    assertEquals( schema.parse( [ '42', '42' ] ), [ 42n, 42n ] )
    assertThrows( () => schema.parse( () => { } ) )
    assertThrows( () => schema.parse( ( arg: any ) => { } ) )
    assertThrows( () => schema.parse( ( arg1: any, arg2: any ) => { } ) )
} )

Deno.test( 'coerce( z.boolean().array() )', () => {
    const schema = zu.coerce( z.boolean().array() )

    /* primitives */
    assertEquals( schema.parse( 'false' ), [ false ] )
    assertEquals( schema.parse( 'true' ), [ true ] )
    assertEquals( schema.parse( 'foo' ), [ true ] )
    assertEquals( schema.parse( 0 ), [ false ] )
    assertEquals( schema.parse( 42 ), [ true ] )
    assertEquals( schema.parse( 42n ), [ true ] )
    assertEquals( schema.parse( true ), [ true ] )
    assertEquals( schema.parse( false ), [ false ] )
    assertEquals( schema.parse( undefined ), [ false ] )
    assertEquals( schema.parse( Symbol( 'symbol' ) ), [ true ] )
    assertEquals( schema.parse( null ), [ false ] )

    /* objects */
    assertEquals( schema.parse( {} ), [ true ] )
    assertEquals( schema.parse( { foo: 'foo' } ), [ true ] )
    assertEquals( schema.parse( { foo: 'foo', bar: 'bar' } ), [ true ] )
    assertEquals( schema.parse( [] ), [] )
    assertEquals( schema.parse( [ 'foo' ] ), [ true ] )
    assertEquals( schema.parse( [ 'foo', 'bar' ] ), [ true, true ] )
    assertEquals( schema.parse( [ 'foo', 'false' ] ), [ true, false ] )
    assertEquals( schema.parse( [ 'false', 'false' ] ), [ false, false ] )
    assertEquals( schema.parse( () => { } ), [ true ] )
    assertEquals( schema.parse( ( arg: any ) => { } ), [ true ] )
    assertEquals( schema.parse( ( arg1: any, arg2: any ) => { } ), [ true ] )
} )

Deno.test( {
    name: 'coerce( z.object().strip() )',
    fn () {
        const schema = zu.coerce(
            z.object( {} ).strip()
        )

        assertEquals(
            schema.parse( { extraKey: 'extraValue' } ),
            {},
        )
    }
} )

Deno.test( {
    name: 'coerce( z.object().passthrough() )',
    fn () {
        const schema = zu.coerce(
            z.object( {} ).passthrough()
        )

        assertEquals(
            schema.parse( { extraKey: 'extraValue' } ),
            { extraKey: 'extraValue' },
        )
    }
} )

Deno.test( {
    name: 'coerce( z.object().strict() )',
    fn () {
        const schema = zu.coerce(
            z.object( {} ).strict()
        )

        assertEquals(
            zu.SPR( schema.safeParse( {
                extraKey: 'extraValue'
            } ) ).error?.issues[ 0 ].message,
            `Unrecognized key(s) in object: 'extraKey'`
        )
    }
} )

Deno.test( 'README Example: z.bigint()', () => {
    const bigintSchema = zu.coerce( z.bigint() )
    assertEquals( bigintSchema.parse( '42' ), 42n )
    assertEquals( bigintSchema.parse( '42n' ), 42n )
    assertEquals(
        zu.SPR( bigintSchema.safeParse( 'foo' ) ).error?.issues[ 0 ].message,
        'Expected bigint, received string'
    )
} )

Deno.test( 'README Example: z.boolean()', () => {
    const booleanSchema = zu.coerce( z.boolean() )

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean
    // only exception to normal boolean coercion rules
    assertEquals( booleanSchema.parse( 'false' ), false )

    // https://developer.mozilla.org/en-US/docs/Glossary/Falsy
    // falsy => false
    assertEquals( booleanSchema.parse( false ), false )
    assertEquals( booleanSchema.parse( 0 ), false )
    assertEquals( booleanSchema.parse( -0 ), false )
    assertEquals( booleanSchema.parse( 0n ), false )
    assertEquals( booleanSchema.parse( '' ), false )
    assertEquals( booleanSchema.parse( null ), false )
    assertEquals( booleanSchema.parse( undefined ), false )
    assertEquals( booleanSchema.parse( NaN ), false )

    // truthy => true
    assertEquals( booleanSchema.parse( 'foo' ), true )
    assertEquals( booleanSchema.parse( 42 ), true )
    assertEquals( booleanSchema.parse( [] ), true )
    assertEquals( booleanSchema.parse( {} ), true )
} )

Deno.test( 'README Example: z.number().array()', () => {
    const numberArraySchema = zu.coerce( z.number().array() )

    // if the value is not an array, it is coerced to an array with one coerced item
    assertEquals( numberArraySchema.parse( 42 ), [ 42 ] )
    assertEquals( numberArraySchema.parse( '42' ), [ 42 ] )

    // if the value is an array, it coerces each item in the array
    assertEquals( numberArraySchema.parse( [] ), [] )
    assertEquals( numberArraySchema.parse( [ '42', 42 ] ), [ 42, 42 ] )

    assertEquals(
        zu.SPR( numberArraySchema.safeParse( 'foo' ) ).error?.issues[ 0 ].message,
        'Expected number, received nan'
    )
} )

Deno.test( {
    name: 'README Example: z.object()',
    fn () {
        const schema = zu.coerce(
            z.object( {
                boolean: z.boolean(),
                bigint: z.bigint(),
                numberArray: z.number().array(),
            } ),
        )

        assertEquals(
            schema.parse( {
                boolean: 'false',
                bigint: '42',
                numberArray: [ '42', 42n ],
            } ),
            {
                boolean: false,
                bigint: 42n,
                numberArray: [ 42, 42 ],
            } as any,
        )

        assertEquals(
            zu.SPR( schema.safeParse( 'foo' ) ).error?.issues[ 0 ].message,
            'Expected object, received string'
        )
    }
} )

// TODO
// Deno.test( 'README Example: z.date()', () => {
//     const schema = zu.coerce( z.date() )
// } )

