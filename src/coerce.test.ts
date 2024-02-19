import { expect, test } from 'bun:test'
import { z } from 'zod'
import { zu } from '.'

test( 'coerce( z.string() )', () => {
    const schema = zu.coerce( z.string() )

    /* primitives */
    expect( schema.parse( 'foo' ) ).toBe( 'foo' )
    expect( schema.parse( 42 ) ).toBe( '42' )
    expect( schema.parse( 42n ) ).toBe( '42' )
    expect( schema.parse( true ) ).toBe( 'true' )
    expect( schema.parse( false ) ).toBe( 'false' )
    expect( schema.parse( undefined ) ).toBe( 'undefined' )
    expect( schema.parse( Symbol( 'symbol' ) ) ).toBe( 'Symbol(symbol)' )
    expect( schema.parse( null ) ).toBe( 'null' )

    /* objects */
    expect( schema.parse( {} ) ).toBe( '{}' )
    expect( schema.parse( { foo: 'foo' } ) ).toBe( '{"foo":"foo"}' )
    expect( schema.parse( { foo: 'foo', bar: 'bar' } ) ).toBe( '{"foo":"foo","bar":"bar"}' )
    expect( schema.parse( [] ) ).toBe( '[]' )
    expect( schema.parse( [ 'foo' ] ) ).toBe( '["foo"]' )
    expect( schema.parse( [ 'foo', 'bar' ] ) ).toBe( '["foo","bar"]' )
    expect( schema.parse( () => { } ) ).toBeTruthy()
    expect( schema.parse( ( arg: any ) => { } ) ).toBeTruthy()
    expect( schema.parse( ( arg1: any, arg2: any ) => { } ) ).toBeTruthy()
} )

test( 'coerce( z.number() )', () => {
    const schema = zu.coerce( z.number() )

    /* primitives */
    expect( () => schema.parse( 'foo' ) ).toThrow()
    expect( schema.parse( '42' ) ).toBe( 42 )
    expect( schema.parse( 42 ) ).toBe( 42 )
    expect( schema.parse( 42n ) ).toBe( 42 )
    expect( schema.parse( true ) ).toBe( 1 )
    expect( schema.parse( false ) ).toBe( 0 )
    expect( () => schema.parse( undefined ) ).toThrow()
    expect( () => schema.parse( Symbol( 'symbol' ) ) ).toThrow()
    expect( () => schema.parse( null ) ).toThrow()

    /* objects */
    expect( () => schema.parse( {} ) ).toThrow()
    expect( () => schema.parse( { foo: 'foo' } ) ).toThrow()
    expect( () => schema.parse( { foo: 'foo', bar: 'bar' } ) ).toThrow()
    expect( () => schema.parse( [] ) ).toThrow()
    expect( () => schema.parse( [ 'foo' ] ) ).toThrow()
    expect( () => schema.parse( [ 'foo', 'bar' ] ) ).toThrow()
    expect( () => schema.parse( () => { } ) ).toThrow()
    expect( () => schema.parse( ( arg: any ) => { } ) ).toThrow()
    expect( () => schema.parse( ( arg1: any, arg2: any ) => { } ) ).toThrow()
} )

test( 'coerce( z.bigint() )', () => {
    const schema = zu.coerce( z.bigint() )

    /* primitives */
    expect( () => schema.parse( 'foo' ) ).toThrow()
    expect( schema.parse( '42' ) ).toBe( 42n )
    expect( schema.parse( '42n' ) ).toBe( 42n )
    expect( schema.parse( 42 ) ).toBe( 42n )
    expect( schema.parse( 42n ) ).toBe( 42n )
    expect( schema.parse( true ) ).toBe( 1n )
    expect( schema.parse( false ) ).toBe( 0n )
    expect( () => schema.parse( undefined ) ).toThrow()
    expect( () => schema.parse( Symbol( 'symbol' ) ) ).toThrow()
    expect( () => schema.parse( null ) ).toThrow()

    /* objects */
    expect( () => schema.parse( {} ) ).toThrow()
    expect( () => schema.parse( { foo: 'foo' } ) ).toThrow()
    expect( () => schema.parse( { foo: 'foo', bar: 'bar' } ) ).toThrow()
    expect( () => schema.parse( [] ) ).toThrow()
    expect( () => schema.parse( [ 'foo' ] ) ).toThrow()
    expect( () => schema.parse( [ 'foo', 'bar' ] ) ).toThrow()
    expect( () => schema.parse( () => { } ) ).toThrow()
    expect( () => schema.parse( ( arg: any ) => { } ) ).toThrow()
    expect( () => schema.parse( ( arg1: any, arg2: any ) => { } ) ).toThrow()
} )

test( 'coerce( z.boolean() )', () => {
    const schema = zu.coerce( z.boolean() )

    /* primitives */
    expect( schema.parse( 'false' ) ).toBe( false )
    expect( schema.parse( 'true' ) ).toBe( true )
    expect( schema.parse( 'foo' ) ).toBe( true )
    expect( schema.parse( 0 ) ).toBe( false )
    expect( schema.parse( 42 ) ).toBe( true )
    expect( schema.parse( 42n ) ).toBe( true )
    expect( schema.parse( true ) ).toBe( true )
    expect( schema.parse( false ) ).toBe( false )
    expect( schema.parse( undefined ) ).toBe( false )
    expect( schema.parse( Symbol( 'symbol' ) ) ).toBe( true )
    expect( schema.parse( null ) ).toBe( false )

    /* objects */
    expect( schema.parse( {} ) ).toBe( true )
    expect( schema.parse( { foo: 'foo' } ) ).toBe( true )
    expect( schema.parse( { foo: 'foo', bar: 'bar' } ) ).toBe( true )
    expect( schema.parse( [] ) ).toBe( true )
    expect( schema.parse( [ 'foo' ] ) ).toBe( true )
    expect( schema.parse( [ 'foo', 'bar' ] ) ).toBe( true )
    expect( schema.parse( () => { } ) ).toBe( true )
    expect( schema.parse( ( arg: any ) => { } ) ).toBe( true )
    expect( schema.parse( ( arg1: any, arg2: any ) => { } ) ).toBe( true )
} )

test( 'coerce( z.any().array() )', () => {
    const schema = zu.coerce( z.any().array() )

    /* primitives */
    expect( schema.parse( 'foo' ) ).toEqual( [ 'foo' ] )
    expect( schema.parse( 42 ) ).toEqual( [ 42 ] )
    expect( schema.parse( 42n ) ).toEqual( [ 42n ] )
    expect( schema.parse( true ) ).toEqual( [ true ] )
    expect( schema.parse( false ) ).toEqual( [ false ] )
    expect( schema.parse( undefined ) ).toEqual( [ undefined ] )
    expect( schema.parse( null ) ).toEqual( [ null ] )

    const symbol = Symbol( 'symbol' )
    expect( schema.parse( symbol ) ).toEqual( [ symbol ] )

    /* objects */
    expect( schema.parse( {} ) ).toEqual( [ {} ] )
    expect( schema.parse( { foo: 'foo' } ) ).toEqual( [ { foo: 'foo' } ] )
    expect( schema.parse( { foo: 'foo', bar: 'bar' } ) ).toEqual( [ { foo: 'foo', bar: 'bar' } ] )
    expect( schema.parse( [] ) ).toEqual( [] )
    expect( schema.parse( [ 'foo' ] ) ).toEqual( [ 'foo' ] )
    expect( schema.parse( [ 'foo', 'bar' ] ) ).toEqual( [ 'foo', 'bar' ] )

    const fn1 = () => { }
    expect( schema.parse( fn1 ) ).toEqual( [ fn1 ] )

    const fn2 = ( arg: any ) => { }
    expect( schema.parse( fn2 ) ).toEqual( [ fn2 ] )

    const fn3 = ( arg1: any, arg2: any ) => { }
    expect( schema.parse( fn3 ) ).toEqual( [ fn3 ] )
} )

test( 'coerce( z.string().array() )', () => {
    const schema = zu.coerce( z.string().array() )

    /* primitives */
    expect( schema.parse( 'foo' ) ).toMatchObject( [ 'foo' ] )
    expect( schema.parse( 42 ) ).toMatchObject( [ '42' ] )
    expect( schema.parse( 42n ) ).toMatchObject( [ '42' ] )
    expect( schema.parse( true ) ).toMatchObject( [ 'true' ] )
    expect( schema.parse( false ) ).toMatchObject( [ 'false' ] )
    expect( schema.parse( undefined ) ).toMatchObject( [ 'undefined' ] )
    expect( schema.parse( null ) ).toMatchObject( [ 'null' ] )

    const symbol = Symbol( 'symbol' )
    expect( schema.parse( symbol ) ).toMatchObject( [ symbol.toString() ] )

    /* objects */
    expect( schema.parse( {} ) ).toMatchObject( [ '{}' ] )
    expect( schema.parse( { foo: 'foo' } ) ).toMatchObject( [ '{"foo":"foo"}' ] )
    expect( schema.parse( { foo: 'foo', bar: 'bar' } ) ).toMatchObject( [ '{"foo":"foo","bar":"bar"}' ] )
    expect( schema.parse( [] ) ).toMatchObject( [] )
    expect( schema.parse( [ 'foo' ] ) ).toMatchObject( [ 'foo' ] )
    expect( schema.parse( [ 'foo', 'bar' ] ) ).toMatchObject( [ 'foo', 'bar' ] )
    expect( schema.parse( [ 'foo', '42' ] ) ).toMatchObject( [ 'foo', '42' ] )
    expect( schema.parse( [ '42', '42' ] ) ).toMatchObject( [ '42', '42' ] )
    expect( schema.parse( () => { } ) ).toBeTruthy()
    expect( schema.parse( ( arg: any ) => { } ) ).toBeTruthy()
    expect( schema.parse( ( arg1: any, arg2: any ) => { } ) ).toBeTruthy()
} )

test( 'coerce( z.number().array() )', () => {
    const schema = zu.coerce( z.number().array() )

    /* primitives */
    expect( () => schema.parse( 'foo' ) ).toThrow()
    expect( schema.parse( '42' ) ).toMatchObject( [ 42 ] )
    expect( schema.parse( 42 ) ).toMatchObject( [ 42 ] )
    expect( schema.parse( 42n ) ).toMatchObject( [ 42 ] )
    expect( schema.parse( true ) ).toMatchObject( [ 1 ] )
    expect( schema.parse( false ) ).toMatchObject( [ 0 ] )
    expect( () => schema.parse( undefined ) ).toThrow()
    expect( () => schema.parse( Symbol( 'symbol' ) ) ).toThrow()
    expect( () => schema.parse( null ) ).toThrow()

    /* objects */
    expect( () => schema.parse( {} ) ).toThrow()
    expect( () => schema.parse( { foo: 'foo' } ) ).toThrow()
    expect( () => schema.parse( { foo: 'foo', bar: 'bar' } ) ).toThrow()
    expect( schema.parse( [] ) ).toEqual( [] )
    expect( () => schema.parse( [ 'foo' ] ) ).toThrow()
    expect( () => schema.parse( [ 'foo', 'bar' ] ) ).toThrow()
    expect( () => schema.parse( [ 'foo', '42' ] ) ).toThrow()
    expect( schema.parse( [ '42', '42' ] ) ).toEqual( [ 42, 42 ] )
    expect( () => schema.parse( () => { } ) ).toThrow()
    expect( () => schema.parse( ( arg: any ) => { } ) ).toThrow()
    expect( () => schema.parse( ( arg1: any, arg2: any ) => { } ) ).toThrow()
} )

test( 'coerce( z.bigint().array() )', () => {
    const schema = zu.coerce( z.bigint().array() )

    /* primitives */
    expect( () => schema.parse( 'foo' ) ).toThrow()
    expect( schema.parse( '42' ) ).toMatchObject( [ 42n ] )
    expect( schema.parse( '42n' ) ).toMatchObject( [ 42n ] )
    expect( schema.parse( 42 ) ).toMatchObject( [ 42n ] )
    expect( schema.parse( 42n ) ).toMatchObject( [ 42n ] )
    expect( schema.parse( true ) ).toMatchObject( [ 1n ] )
    expect( schema.parse( false ) ).toMatchObject( [ 0n ] )
    expect( () => schema.parse( undefined ) ).toThrow()
    expect( () => schema.parse( Symbol( 'symbol' ) ) ).toThrow()
    expect( () => schema.parse( null ) ).toThrow()

    /* objects */
    expect( () => schema.parse( {} ) ).toThrow()
    expect( () => schema.parse( { foo: 'foo' } ) ).toThrow()
    expect( () => schema.parse( { foo: 'foo', bar: 'bar' } ) ).toThrow()
    expect( schema.parse( [] ) ).toMatchObject( [] )
    expect( () => schema.parse( [ 'foo' ] ) ).toThrow()
    expect( () => schema.parse( [ 'foo', 'bar' ] ) ).toThrow()
    expect( () => schema.parse( [ 'foo', '42' ] ) ).toThrow()
    expect( schema.parse( [ '42', '42' ] ) ).toMatchObject( [ 42n, 42n ] )
    expect( () => schema.parse( () => { } ) ).toThrow()
    expect( () => schema.parse( ( arg: any ) => { } ) ).toThrow()
    expect( () => schema.parse( ( arg1: any, arg2: any ) => { } ) ).toThrow()
} )

test( 'coerce( z.boolean().array() )', () => {
    const schema = zu.coerce( z.boolean().array() )

    /* primitives */
    expect( schema.parse( 'false' ) ).toMatchObject( [ false ] )
    expect( schema.parse( 'true' ) ).toMatchObject( [ true ] )
    expect( schema.parse( 'foo' ) ).toMatchObject( [ true ] )
    expect( schema.parse( 0 ) ).toMatchObject( [ false ] )
    expect( schema.parse( 42 ) ).toMatchObject( [ true ] )
    expect( schema.parse( 42n ) ).toMatchObject( [ true ] )
    expect( schema.parse( true ) ).toMatchObject( [ true ] )
    expect( schema.parse( false ) ).toMatchObject( [ false ] )
    expect( schema.parse( undefined ) ).toMatchObject( [ false ] )
    expect( schema.parse( Symbol( 'symbol' ) ) ).toMatchObject( [ true ] )
    expect( schema.parse( null ) ).toMatchObject( [ false ] )

    /* objects */
    expect( schema.parse( {} ) ).toMatchObject( [ true ] )
    expect( schema.parse( { foo: 'foo' } ) ).toMatchObject( [ true ] )
    expect( schema.parse( { foo: 'foo', bar: 'bar' } ) ).toMatchObject( [ true ] )
    expect( schema.parse( [] ) ).toMatchObject( [] )
    expect( schema.parse( [ 'foo' ] ) ).toMatchObject( [ true ] )
    expect( schema.parse( [ 'foo', 'bar' ] ) ).toMatchObject( [ true, true ] )
    expect( schema.parse( [ 'foo', 'false' ] ) ).toMatchObject( [ true, false ] )
    expect( schema.parse( [ 'false', 'false' ] ) ).toMatchObject( [ false, false ] )
    expect( schema.parse( () => { } ) ).toMatchObject( [ true ] )
    expect( schema.parse( ( arg: any ) => { } ) ).toMatchObject( [ true ] )
    expect( schema.parse( ( arg1: any, arg2: any ) => { } ) ).toMatchObject( [ true ] )
} )

test( 'README Example: z.bigint()', () => {
    const bigintSchema = zu.coerce( z.bigint() )
    expect( bigintSchema.parse( '42' ) ).toBe( 42n )
    expect( bigintSchema.parse( '42n' ) ).toBe( 42n )
    expect( zu.SPR( bigintSchema.safeParse( 'foo' ) ).error?.issues[ 0 ].message )
        .toBe( 'Expected bigint, received string' )
} )

test( 'README Example: z.boolean()', () => {
    const booleanSchema = zu.coerce( z.boolean() )

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean
    // only exception to normal boolean coercion rules
    expect( booleanSchema.parse( 'false' ) ).toBe( false )

    // https://developer.mozilla.org/en-US/docs/Glossary/Falsy
    // falsy => false
    expect( booleanSchema.parse( false ) ).toBe( false )
    expect( booleanSchema.parse( 0 ) ).toBe( false )
    expect( booleanSchema.parse( -0 ) ).toBe( false )
    expect( booleanSchema.parse( 0n ) ).toBe( false )
    expect( booleanSchema.parse( '' ) ).toBe( false )
    expect( booleanSchema.parse( null ) ).toBe( false )
    expect( booleanSchema.parse( undefined ) ).toBe( false )
    expect( booleanSchema.parse( NaN ) ).toBe( false )

    // truthy => true
    expect( booleanSchema.parse( 'foo' ) ).toBe( true )
    expect( booleanSchema.parse( 42 ) ).toBe( true )
    expect( booleanSchema.parse( [] ) ).toBe( true )
    expect( booleanSchema.parse( {} ) ).toBe( true )
} )

test( 'README Example: z.number().array()', () => {
    const numberArraySchema = zu.coerce( z.number().array() )

    // if the value is not an array, it is coerced to an array with one coerced item
    expect( numberArraySchema.parse( 42 ) ).toMatchObject( [ 42 ] )
    expect( numberArraySchema.parse( '42' ) ).toMatchObject( [ 42 ] )

    // if the value is an array, it coerces each item in the array
    expect( numberArraySchema.parse( [] ) ).toMatchObject( [] )
    expect( numberArraySchema.parse( [ '42', 42 ] ) ).toMatchObject( [ 42, 42 ] )

    expect( zu.SPR( numberArraySchema.safeParse( 'foo' ) ).error?.issues[ 0 ].message )
        .toBe( 'Expected number, received nan' )
} )

// TODO
// test( 'README Example: z.date()', () => {
//     const schema = zu.coerce( z.date() )
// } )

// TODO
// test( 'README Example: z.object()', () => {
//     const schema = zu.coerce( z.object() )
// } )