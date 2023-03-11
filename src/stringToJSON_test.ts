import { z } from 'zod'
import { zu } from '../mod.ts'
import { assertEquals, assertThrows } from 'std/testing/asserts.ts'

Deno.test( 'stringToJSON', () => {
    const schema = zu.stringToJSON()

    /* allowed primitives */
    assertEquals( schema.parse( '"foo"' ), 'foo' )
    assertEquals( schema.parse( '42' ), 42 )
    assertEquals( schema.parse( 'true' ), true )
    assertEquals( schema.parse( 'false' ), false )
    assertEquals( schema.parse( 'null' ), null )

    /* disallowed primitives */
    assertThrows( () => schema.parse( '42n' ) )
    assertThrows( () => schema.parse( 'undefined' ) )

    /* valid objects */
    const nested = { one: [ 'two', { three: 4 } ] }
    assertEquals( schema.parse( JSON.stringify( nested ) ), nested )

    /* invalid JSON */
    assertThrows( () => schema.parse( '{ keys: "must be quoted" }' ) )
    assertThrows( () => schema.parse( '{ "objects": "must be closed"' ) )
    assertThrows( () => schema.parse( '"arrays", "must", "be", "opened" ]' ) )
    assertThrows( () => schema.parse( '<html>is not JSON</html>' ) )

    /* piping */
    const jsonNumberSchema = zu.stringToJSON().pipe( z.number() )
    assertEquals( jsonNumberSchema.parse( '500' ), 500 )
    assertThrows( () => jsonNumberSchema.parse( '"JSON, but not a number"' ) )
} )

Deno.test( 'stringToJSON', () => {
    const schema = zu.stringToJSON()

    assertEquals( schema.parse( 'true' ), true )
    assertEquals( schema.parse( 'null' ), null )
    assertEquals(
        schema.parse( '["one", "two", "three"]' ),
        [ 'one', 'two', 'three' ]
    )
    assertThrows( () => schema.parse( '<html>not a JSON string</html>' ) )
} )