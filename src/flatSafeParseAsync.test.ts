import { expect, test } from 'bun:test'
import { z } from 'zod'
import { zu } from '.'

const userSchema = z.object( { name: z.string(), age: z.number() } )

test( 'should return valid data', async () => {
    const data = await zu.flatSafeParseAsync( userSchema, { name: 'foo', age: 42 } )
    expect( data ).toMatchObject( {
       name: 'foo',
       age: 42
    } )
} )

test( 'should throw an field error', () => {
    // @ts-ignore
    const result = zu.flatSafeParseAsync( userSchema, { name: null, age: 42 } )
    expect( result ).rejects.toThrow( new Error( 'name: Expected string, received null' ))
} )

test ( 'should throw a form error', () => {
    const result = zu.flatSafeParseAsync( userSchema, null )
    expect( result ).rejects.toThrow( new Error( 'Expected object, received null' ))
})


test( `Readme Example`, () => {
    const userSchema = z.object( { name: z.string(), age: z.number() } )
    const result = zu.partialSafeParse( userSchema, { name: null, age: 42 } )
    expect( result ).toMatchObject( {
        successType: 'partial',
        validData: { age: 42 },
        invalidData: { name: null },
    } )
    expect( result.error?.flatten().fieldErrors ?? {} ).toMatchObject( {
        name: [ 'Expected string, received null' ]
    } )
} )
