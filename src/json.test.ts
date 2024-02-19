import { expect, test } from 'bun:test'
import { zu } from '.'

test( 'json', () => {
    const schema = zu.json()

    /* allowed primitives */
    expect( schema.parse( 'foo' ) ).toBe( 'foo' )
    expect( schema.parse( 42 ) ).toBe( 42 )
    expect( schema.parse( true ) ).toBe( true )
    expect( schema.parse( false ) ).toBe( false )
    expect( schema.parse( null ) ).toBe( null )

    /* disallowed primitives */
    expect( () => schema.parse( 42n ) ).toThrow()
    expect( () => schema.parse( Symbol( 'symbol' ) ) ).toThrow()
    expect( () => schema.parse( undefined ) ).toThrow()
    expect( () => schema.parse( new Date() ) ).toThrow()

    /* objects */
    const nested = { one: [ 'two', { three: 4 } ] }
    expect( schema.parse( nested ) ).toMatchObject( nested )
} )

test( 'README Example', () => {
    const schema = zu.json()
    expect( schema.parse( false ) ).toBe( false )
    expect( schema.parse( 8675309 ) ).toBe( 8675309 )
    expect( schema.parse( { a: 'deeply', nested: [ 'JSON', 'object' ] } ) )
        .toMatchObject( { a: 'deeply', nested: [ 'JSON', 'object' ] } )
} )