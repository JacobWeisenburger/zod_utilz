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
    assertEquals(
        zu.json().parse( { some: [ 'json', 'object' ] } ),
        { some: [ 'json', 'object' ] }
    )
} )