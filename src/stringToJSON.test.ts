import { expect, test } from 'bun:test'
import { z } from 'zod'
import { zu } from '.'

test( 'stringToJSON', () => {
    const schema = zu.stringToJSON()

    /* allowed primitives */
    expect( schema.parse( '"foo"' ) ).toBe( 'foo' )
    expect( schema.parse( '42' ) ).toBe( 42 )
    expect( schema.parse( 'true' ) ).toBe( true )
    expect( schema.parse( 'false' ) ).toBe( false )
    expect( schema.parse( 'null' ) ).toBe( null )

    /* disallowed primitives */
    expect( () => schema.parse( '42n' ) ).toThrow()
    expect( () => schema.parse( 'undefined' ) ).toThrow()

    /* valid objects */
    const nested = { one: [ 'two', { three: 4 } ] }
    expect( schema.parse( JSON.stringify( nested ) ) ).toMatchObject( nested )

    /* invalid JSON */
    expect( () => schema.parse( '{ keys: "must be quoted" }' ) ).toThrow()
    expect( () => schema.parse( '{ "objects": "must be closed"' ) ).toThrow()
    expect( () => schema.parse( '"arrays", "must", "be", "opened" ]' ) ).toThrow()
    expect( () => schema.parse( '<html>is not JSON</html>' ) ).toThrow()

    /* piping */
    const jsonNumberSchema = zu.stringToJSON().pipe( z.number() )
    expect( jsonNumberSchema.parse( '500' ) ).toBe( 500 )
    expect( () => jsonNumberSchema.parse( '"JSON, but not a number"' ) ).toThrow()
} )

test( 'stringToJSON', () => {
    const schema = zu.stringToJSON()

    expect( schema.parse( 'true' ) ).toBe( true )
    expect( schema.parse( 'null' ) ).toBe( null )
    expect( schema.parse( '["one", "two", "three"]' ) )
        .toMatchObject( [ 'one', 'two', 'three' ] )
    expect( () => schema.parse( '<html>not a JSON string</html>' ) ).toThrow()
} )