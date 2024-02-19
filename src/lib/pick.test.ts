import { expect, test } from 'bun:test'
import { pick } from './pick'

const obj = {
    foo: 'foo',
    bar: 42,
    baz: true,
}

test( 'pick', () => {
    expect( pick( obj, [] ) ).toMatchObject( {} )
    expect( pick( obj, [ 'foo' ] ) ).toMatchObject( { foo: 'foo' } )
    expect( pick( obj, [ 'foo', 'bar' ] ) ).toMatchObject( { foo: 'foo', bar: 42 } )
} )