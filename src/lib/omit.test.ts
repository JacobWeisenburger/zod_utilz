import { expect, test } from 'bun:test'
import { omit } from './omit'

const obj = {
    foo: 'foo',
    bar: 42,
    baz: true,
}

test( 'omit', () => {
    expect( omit( obj, [] ) ).toMatchObject( obj )
    expect( omit( obj, [ 'foo' ] ) ).toMatchObject( { bar: 42, baz: true } )
    expect( omit( obj, [ 'foo', 'bar' ] ) ).toMatchObject( { baz: true } )
} )