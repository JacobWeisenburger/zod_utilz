import { omit } from './omit.ts'
import { assertEquals } from 'std/testing/asserts.ts'

const obj = {
    foo: 'foo',
    bar: 42,
    baz: true,
}

Deno.test( 'omit', () => {
    assertEquals(
        omit( obj, [] ),
        obj
    )
    assertEquals(
        omit( obj, [ 'foo' ] ),
        { bar: 42, baz: true }
    )
    assertEquals(
        omit( obj, [ 'foo', 'bar' ] ),
        { baz: true }
    )
} )