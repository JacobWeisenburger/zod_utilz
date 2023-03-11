import { zu } from '../mod.ts'
import { assertEquals, assertThrows } from 'std/testing/asserts.ts'

Deno.test( 'json', () => {
    const schema = zu.json()

    /* allowed primitives */
    assertEquals( schema.parse( 'foo' ), 'foo' )
    assertEquals( schema.parse( 42 ), 42 )
    assertEquals( schema.parse( true ), true )
    assertEquals( schema.parse( false ), false )
    assertEquals( schema.parse( null ), null )

    /* disallowed primitives */
    assertThrows( () => schema.parse( 42n ) )
    assertThrows( () => schema.parse( Symbol( 'symbol' ) ) )
    assertThrows( () => schema.parse( undefined ) )
    assertThrows( () => schema.parse( new Date() ) )

    /* objects */
    const nested = { one: [ 'two', { three: 4 } ] }
    assertEquals( schema.parse( nested ), nested )
} )

Deno.test( 'README Example', () => {
    const schema = zu.json()
    assertEquals(
        schema.parse( false ),
        false
    )
    assertEquals(
        schema.parse( 8675309 ),
        8675309
    )
    assertEquals(
        schema.parse( { a: 'deeply', nested: [ 'JSON', 'object' ] } ),
        { a: 'deeply', nested: [ 'JSON', 'object' ] }
    )
} )