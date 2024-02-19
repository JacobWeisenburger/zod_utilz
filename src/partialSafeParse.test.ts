import { expect, test } from 'bun:test'
import { z } from 'zod'
import { zu } from '.'

const userSchema = z.object( { name: z.string(), age: z.number() } )

test( `successType: 'full'`, () => {
    const result = zu.partialSafeParse( userSchema, { name: 'foo', age: 42 } )
    expect( result ).toMatchObject( {
        successType: 'full',
        data: { name: 'foo', age: 42 },
        validData: { name: 'foo', age: 42 },
        invalidData: {},
    } )

    // @ts-ignore
    expect( result.error ).toBe( undefined )
} )

test( `successType: 'partial': { name: null, age: 42 }`, () => {
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

test( `successType: 'partial': { name: null }`, () => {
    const result = zu.partialSafeParse( userSchema, { name: null } )
    expect( result ).toMatchObject( {
        successType: 'partial',
        validData: {},
        invalidData: { name: null },
    } )
    expect( result.error?.flatten().fieldErrors ?? {} ).toMatchObject( {
        name: [ 'Expected string, received null' ],
        age: [ 'Required' ],
    } )
} )

test( `successType: 'partial': {}`, () => {
    const result = zu.partialSafeParse( userSchema, {} )
    expect( result ).toMatchObject( {
        successType: 'partial',
        validData: {},
        invalidData: {},
    } )
    expect( result.error?.flatten().fieldErrors ?? {} ).toMatchObject( {
        name: [ 'Required' ],
        age: [ 'Required' ],
    } )
} )

test( `successType: 'none'`, () => {
    const result = zu.partialSafeParse( userSchema, null )
    expect( result ).toMatchObject( {
        successType: 'none',
        validData: {},
        invalidData: {},
    } )
    expect( result.error?.flatten().formErrors ?? [] ).toMatchObject( [
        'Expected object, received null'
    ] )
} )

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

// test( `with useURLSearchParams`, () => {
//     const params = new URLSearchParams( 'foo=foo&bar=42' )
//     const schema = zu.useURLSearchParams(
//         z.object( { foo: z.string(), bar: z.string() } )
//     )
//     // const schema: z.ZodPipeline<z.ZodEffects<z.ZodType<FormData | URLSearchParams, z.ZodTypeDef, FormData | URLSearchParams>, Record<string, any>, FormData | URLSearchParams>, z.ZodObject<...>>


//     //@ts-ignore
//     const result = zu.partialSafeParse( schema, params )
//     console.log( result )
//     // expect(
//     //     result,
//     //     {
//     //         successType: 'partial',
//     //         validData: { age: 42 },
//     //         invalidData: { name: null },
//     //     }
//     // )
//     // expect(
//     //     result.error?.flatten().fieldErrors ?? {},
//     //     {
//     //         name: [ 'Expected string, received null' ],
//     //     }
//     // )
// } )