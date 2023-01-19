import { z } from 'zod'
import { zu } from '../mod.ts'
import { assertEquals, assertThrows, assert } from 'std/testing/asserts.ts'

Deno.test( 'zu.coerce( z.string() )', () => {
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
    assert( schema.safeParse( () => { } ).success )
    assert( schema.safeParse( ( arg: any ) => { } ).success )
    assert( schema.safeParse( ( arg1: any, arg2: any ) => { } ).success )
} )

Deno.test( 'zu.coerce( z.number() )', () => {
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

Deno.test( 'zu.coerce( z.bigint() )', () => {
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

Deno.test( 'zu.coerce( z.boolean() )', () => {
    const schema = zu.coerce( z.boolean() )
    // const schema = z.boolean().transform( ( value ) =>  'true' )

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

Deno.test( 'zu.coerce( z.any().array() )', () => {
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

Deno.test( 'README Example: bigint', () => {
    const schema = zu.coerce( z.bigint() )
    assertEquals(
        zu.SPR( schema.safeParse( '42' ) ).data,
        42n
    )
    assertEquals(
        zu.SPR( schema.safeParse( 'foo' ) ).error?.issues[ 0 ].message,
        'Expected bigint, received string'
    )
} )

// TODO
// Deno.test( 'README Example: date', () => {
//     const schema = zu.coerce( z.date() )
// } )

// TODO
// Deno.test( 'README Example: object', () => {
//     const schema = zu.coerce( z.object() )
// } )