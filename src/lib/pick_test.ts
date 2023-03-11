import { pick } from './pick.ts'
import { assertEquals } from 'std/testing/asserts.ts'

const obj = {
    foo: 'foo',
    bar: 42,
    baz: true,
}

Deno.test( 'pick', () => {
    assertEquals(
        pick( obj, [] ),
        {}
    )
    assertEquals(
        pick( obj, [ 'foo' ] ),
        { foo: 'foo' }
    )
    assertEquals(
        pick( obj, [ 'foo', 'bar' ] ),
        { foo: 'foo', bar: 42 }
    )
} )